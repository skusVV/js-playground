import React from 'react';
import './Popup.css';
import Redactor from './Redactor';
import {
  LOCAL_STORAGE_FONT_SIZE_KEY,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_THEME_KEY,
  LODASH_KEY, MOMENT_KEY,
  RXJS_KEY
} from "./constants";
import settings from "../../assets/img/settings.svg";
import Modal from "./Modal";

const PANELS_STATE_KEY = 'PANELS_STATE_KEY';
const ACTIVE_PANEL_KEY = 'ACTIVE_PANEL_KEY';

class Popup extends React.Component {
  initialSettings = {
    show: false,
    fontSize: localStorage.getItem(LOCAL_STORAGE_FONT_SIZE_KEY) || 10,
    theme:  localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || 'dark',
    lodash:  localStorage.getItem(LODASH_KEY) === 'true' ||  false,
    rxjs:  localStorage.getItem(RXJS_KEY) === 'true' ||  false,
    moment:  localStorage.getItem(MOMENT_KEY) === 'true' ||  false
  }


  state = {
    panels:  localStorage.getItem(PANELS_STATE_KEY)
        ? JSON.parse(localStorage.getItem(PANELS_STATE_KEY)) :
        [
          { id: 0 }
        ],
    activePanelId:  localStorage.getItem(ACTIVE_PANEL_KEY) ? JSON.parse(localStorage.getItem(ACTIVE_PANEL_KEY)) : 0,
    settings: this.initialSettings
  };

  onNewPanel = () =>{
    const id = Math.random();
    const panels = [ ...this.state.panels, { id }];

    localStorage.setItem(PANELS_STATE_KEY, JSON.stringify(panels));
    localStorage.setItem(ACTIVE_PANEL_KEY, JSON.stringify(id));

    this.setState({ panels, activePanelId: id})
  }

  onPanelChange = (id) => {
    localStorage.setItem(ACTIVE_PANEL_KEY, JSON.stringify(id));
    this.setState({ activePanelId: id});

  }

  onRemovePanel = (id) => {
    if(this.state.panels.length === 1) {
      return;
    }
    // We need
    localStorage.removeItem(LOCAL_STORAGE_KEY + id)
    const panels = this.state.panels.filter(item => item.id !== id);
    this.setState({ panels  });

    localStorage.setItem(PANELS_STATE_KEY, JSON.stringify(panels));

    setTimeout(() => {
      const currentId = this.state.panels[this.state.panels.length - 1].id;
      this.setState({ activePanelId: currentId });
      localStorage.setItem(ACTIVE_PANEL_KEY, JSON.stringify(currentId));
    }, 0)

  }

  onChangeLib = (isChecked, name) => {
    this.setState({ settings: {...this.state.settings, [name]: isChecked}})
    localStorage.setItem([name], isChecked);
  }

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

  render() {
    return (
      <section className="container">
        <div className="panels">
          {
            this.state.panels.map((item, index) => <div className={`tab-item ${item.id === this.state.activePanelId? 'tab-item-selected' : ''} `} onClick={() => this.onPanelChange(item.id)} >
              <div className="tab-item-name">{`Tab ${index + 1}`}</div>
              <div className="tab-item-close" onClick={() => this.onRemovePanel(item.id)}>&#x2715;</div>
            </div>)
          }
          {
            this.state.panels.length < 5 && <div className="tab-item tab-plus" onClick={this.onNewPanel}>+</div>
          }
        </div>
          {
            this.state.panels
                  .map((item, index) => <Redactor key={item.id} settings={this.state.settings} tabId={item.id} activePanelId={this.state.activePanelId}/> )
          }
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
