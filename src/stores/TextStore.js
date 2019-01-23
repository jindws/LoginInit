import {action, observable, autorun} from 'mobx';
import languages from '../languages';

class TextStore {
  @observable currentLanguage = 'zh-CN';

  constructor() {
    const local = localStorage.getItem("community-language");
    const lang = local || (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));
    this.changeLanguage(lang.includes('zh') ? 'zh-CN' : 'en-US');
    // window.tt = this\
    autorun(() => this.text = word => languages[this.currentLanguage][word]);
    autorun(() => {
      Object.entries(languages[this.currentLanguage]).forEach(([key, value]) => {
        this[key] = value;
      })
    })
  }

  @action changeLanguage = (type) => {
    this.currentLanguage = type;
    localStorage.setItem("community-language", type);
  }
}

export default new TextStore();
