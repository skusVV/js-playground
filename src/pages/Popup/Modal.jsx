import React from 'react';

class Modal extends React.Component {

    onThemeChange = e => {
        this.props.onThemeChange(e.currentTarget.value);
    }

    render() {
        const background = this.props.settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        const color = this.props.settings.theme === 'dark' ? '#000' : '#fff';
        return (
            <section className="modal" style={{background, color}}>
                <div className="modal-row">
                    <div>Theme:</div>
                    <div>
                        <input type="radio" id="dark" name="theme" value="dark" checked={this.props.settings.theme === 'dark'} onChange={this.onThemeChange} />
                        <label htmlFor="dark">Dark</label>
                        <input type="radio" id="light" name="theme" value="light" checked={this.props.settings.theme === 'light'} onChange={this.onThemeChange}/>
                        <label htmlFor="light">Light</label>
                    </div>
                </div>
                <div className="modal-row">
                    <div>Font-size:</div>
                    <div>
                        <input type="range" min={6} max={20} value={this.props.settings.fontSize} onChange={e => this.props.onFontSizeChange(e.currentTarget.value)}/>
                    </div>
                </div>
                <div className="modal-column">
                    <div>Libraries: </div>
                    <div className="modal-column">
                        <div className="lib-item">
                            <label htmlFor="lodash">Lodash [Ref as "_"]</label>
                            <input type="checkbox" id="lodash" name="lodash" checked={this.props.settings.lodash} onChange={e => this.props.onChangeLib(e.currentTarget.checked, 'lodash')}/>
                        </div>
                        <div className="lib-item">
                            <label htmlFor="rxjs">rxjs [Ref as "rxjs"]</label>
                            <input type="checkbox" id="rxjs" name="rxjs" checked={this.props.settings.rxjs} onChange={e => this.props.onChangeLib(e.currentTarget.checked, 'rxjs')}/>
                        </div>
                        <div className="lib-item">
                            <label htmlFor="moment">Moment [Ref as "moment"]</label>
                            <input type="checkbox" id="moment" name="moment" checked={this.props.settings.moment} onChange={e => this.props.onChangeLib(e.currentTarget.checked, 'moment')}/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Modal;
