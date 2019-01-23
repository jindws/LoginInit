import React, {Component} from 'react';
import styles from './styles.module.scss';
import {observer, inject} from 'mobx-react';
import translateIcon from './translate.svg';

@inject('TextStore')
@observer
export default class Translate extends Component {
  toggleLanguage = () => {
    const {changeLanguage, currentLanguage} = this.props.TextStore;
    changeLanguage(currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN');
  };

  render() {
    return <img className={styles.translateToggle} src={translateIcon} onClick={this.toggleLanguage} alt='translate'/>
  }
}
