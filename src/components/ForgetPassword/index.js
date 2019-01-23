import React, {Component} from 'react';
import styles from './styles.module.scss';
import {observer, inject} from 'mobx-react';
import {observable, when} from 'mobx';
import {Icon} from 'antd';
import logo from '../App/rsquared_logo_color.svg';
import 'antd/lib/icon/style/index.css'


@inject('UserStore', 'TextStore', 'routing')
@observer
export default class ForgetPassword extends Component {
  @observable email = "";

  constructor(props) {
    super(props);
    const {routing, UserStore} = props;
    when(
      () => UserStore.init && UserStore.isLogin,
      () => routing.push("/")
    )
  }

  handleChange = e => {
    this.email = e.target.value;
  }

  submit = () => {
    this.props.UserStore.forgetPassword(this.email).then(() => {
      this.props.history.push("/success/forget-password");
    }, () => {
    })
  };

  goLogin = () => {
    this.props.history.push("/");
  };

  goHome = () => {
    this.props.history.push("/");
  };

  render() {
    const {loading, init} = this.props.UserStore;
    const {text} = this.props.TextStore;
    return init && <div className={styles.forgetPassword}>
      <div className={styles.info}>
        <div className={styles.back} onClick={this.goLogin}><Icon type="left"/></div>
        <div className={styles.top}>
          <div className={styles.logo}><img src={logo} alt='R2.ai' onClick={this.goHome}/></div>
          <div className={styles.login}>{text("forget.remember")}<span
            onClick={this.goLogin}>{text("forget.login")}</span></div>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{text('forget.title')}</div>
          <div className={styles.text} dangerouslySetInnerHTML={{__html: text('forget.content')}}/>
          <div className={styles.input}>
            <label htmlFor='forget-email'>{text('forget.label')}</label>
            <input id="forget-email" placeholder={text('forget.input')} value={this.email}
                   onChange={this.handleChange}/>
          </div>
          <div className={styles.button} onClick={loading ? null : this.submit}>{loading ?
            <Icon type="loading"/> : text("Submit")}</div>
        </div>
      </div>
    </div>
  }
}
