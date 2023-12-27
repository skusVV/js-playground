import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Inspector } from 'react-inspector';
import './Popup.css';
import { myCompletions } from './autocomplete';
import { autocompletion } from '@codemirror/autocomplete';
import { LOCAL_STORAGE_FONT_SIZE_KEY, URL, LOCAL_STORAGE_THEME_KEY, LOCAL_STORAGE_KEY, examples} from './constants'

const DELAY = 500;
class Redactor extends React.Component {
    setItem = (key, value) => {
        localStorage.setItem(key + this.props.tabId, value);
    }

    getItem = (key) => {
        return localStorage.getItem(key + this.props.tabId);
    }

    initialCode = this.getItem(LOCAL_STORAGE_KEY) || examples[Math.floor(Math.random()*examples.length)];

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanelId !== this.props.activePanelId) {
            this.setState({ value: this.getItem(LOCAL_STORAGE_KEY) || `console.log('Hello World');` })
        }
    }

    state = {
        value: this.initialCode,
        height: 420,
        output: [],
        error: null,
        intervalRef: null
    };

    componentDidMount() {
        this.handle();
    }

    handle = () => {
        this.setItem(LOCAL_STORAGE_KEY, this.state.value);
        clearInterval(this.state.intervalRef);
        const intervalRef = setInterval(() => {
            this.setState({ output: [] });
            const { lodash, rxjs, moment } = this.props.settings;
            fetch(URL, {
                method: 'POST',
                body: JSON.stringify({ str: this.state.value, lodash, rxjs, moment }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.status === 404) {
                        return response.text();
                    }
                    return response.json();
                })
                .then((output) => {
                    if (typeof output === 'string') {
                        this.setState({ error: output, output: []});
                    } else {
                        this.setState({ output, error: null })
                    }

                    clearInterval(this.state.intervalRef);
                }).catch(err => {
                clearInterval(this.state.intervalRef);
            });
        }, DELAY);

        this.setState({ intervalRef })
    };

    onThemeChange = e => {
        const settings = {...this.state.settings, theme: e };
        this.setState({ settings });
        this.setItem(LOCAL_STORAGE_THEME_KEY, e)
    }

    onFontSizeChange = e => {
        const settings = {...this.state.settings, fontSize: e };
        this.setState({ settings });
        this.setItem(LOCAL_STORAGE_FONT_SIZE_KEY, e)
    }

    render() {
        if(this.props.tabId !== this.props.activePanelId) {
            return null;
        }

        return (
            <section className="container" key={this.props.tabId}>
                <CodeMirror
                    style={{fontSize: this.props.settings.fontSize + 'px'}}
                    basicSetup={true}
                    value={this.state.value}
                    height={`${this.state.height}px`}
                    extensions={[javascript({ typescript: false }), autocompletion({override: [myCompletions]})]}
                    onChange={(value, viewUpdate) => {
                        this.setState({ value });
                        this.handle();
                    }}
                    theme={this.props.settings.theme}
                />
                {
                    Boolean(this.state.output.length) &&
                    <div className="output">
                        {this.state.output.map((item, i) => {
                            return (
                                <div key={i}>
                                    {item.map((elem, j) => {
                                        return <Inspector  showNonenumerable={true} key={i + j} data={elem} />;
                                    })}
                                </div>
                            );
                        })}
                    </div>
                }
                <span className="error">{ this.state.error }</span>
            </section>
        );
    }
}

export default Redactor;
