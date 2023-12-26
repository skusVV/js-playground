import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Inspector } from 'react-inspector';
import './Popup.css';
import settings from '../../assets/img/settings.svg';
import Modal from './Modal';
import { myCompletions } from './autocomplete';
import { autocompletion } from '@codemirror/autocomplete';
import { LOCAL_STORAGE_FONT_SIZE_KEY, MOMENT_KEY, LODASH_KEY, RXJS_KEY, URL, LOCAL_STORAGE_THEME_KEY, LOCAL_STORAGE_KEY} from './constants'

const initialCode = localStorage.getItem(LOCAL_STORAGE_KEY) || `console.log('Hello World');`;
const initialSettings = {
  show: false,
  fontSize:localStorage.getItem(LOCAL_STORAGE_FONT_SIZE_KEY) || 10,
  theme: localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || 'dark',
  lodash: localStorage.getItem(LODASH_KEY) === 'true' ||  false,
  rxjs: localStorage.getItem(RXJS_KEY) === 'true' ||  false,
  moment: localStorage.getItem(MOMENT_KEY) === 'true' ||  false
}

// go to "node_modules/regenerator_runtime/dist/es/react-inspector.js" and comment line 744  Function("r", "regeneratorRuntime = r")(runtime);

let intervalRef;
const DELAY = 500;
class Popup extends React.Component {
  state = {
    value: initialCode,
    height: 420,
    output: [],
    error: null,
    settings: initialSettings
  };

  componentDidMount() {
    this.handle();
  }

  handle = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, this.state.value);
    clearInterval(intervalRef);
    intervalRef = setInterval(() => {
      this.setState({ output: [] });
      const { lodash, rxjs, moment } = this.state.settings;
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
          clearInterval(intervalRef);
        }).catch(err => {
          clearInterval(intervalRef);
      });
    }, DELAY);
  };

  onThemeChange = e => {
    const settings = {...this.state.settings, theme: e };
    this.setState({ settings });
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, e)
  }

  onFontSizeChange = e => {
    const settings = {...this.state.settings, fontSize: e };
    this.setState({ settings });
    localStorage.setItem(LOCAL_STORAGE_FONT_SIZE_KEY, e)
  }

  onChangeLib = (isChecked, name) => {
    this.setState({ settings: {...this.state.settings, [name]: isChecked}})
    localStorage.setItem([name], isChecked);
    this.handle();
  }

  render() {
    return (
      <section className="container">
        <CodeMirror
          style={{fontSize: this.state.settings.fontSize + 'px'}}
          basicSetup={true}
          value={this.state.value}
          height={`${this.state.height}px`}
          extensions={[javascript({ typescript: false }), autocompletion({override: [myCompletions]})]}
          onChange={(value, viewUpdate) => {
            this.setState({ value });
            this.handle();
          }}
          theme={this.state.settings.theme}
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
        <img className="settings" src={settings} onClick={() => this.setState({ settings: {...this.state.settings, show: !this.state.settings.show}})}/>
        {
          this.state.settings.show && <Modal
                settings={this.state.settings}
                onThemeChange={this.onThemeChange}
                onFontSizeChange={this.onFontSizeChange}
                onChangeLib={this.onChangeLib}/>
        }
      </section>
    );
  }
}

export default Popup;
