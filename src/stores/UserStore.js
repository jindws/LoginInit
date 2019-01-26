import TextStore from '../stores/TextStore';
import {action, computed, observable, runInAction} from 'mobx';
import {message} from 'antd';
import {omit} from 'lodash'
// import {postData, getData, putData} from '../services/fetch'
import 'antd/lib/message/style/index.css'
import DB from '../services/db.js'

const STORAGE_KEY = "r2ai_community";

class UserStore {
  @observable email = "";
  @observable loading = false;
  @observable init = false;
  @observable error = "";
  @observable info = {};
  @observable admin = false;

  constructor() {
    if (localStorage.getItem(STORAGE_KEY)) {
      this.tryLogin()
    } else {
      this.init = true;
    }
  }

  @computed
  get isLogin() {
    return !!this.email;
  }

  @action
  register = (data) => {
    if (this.loading) return;
    this.loading = true;
    data.email = data.email||'';
    // data.phone = data.telephone;
    // data.username = data.userName;
    // data.language = TextStore.currentLanguage;
    // const userData = omit(data, ['companyEmail', 'telephone', 'userName']);
    const checkd = this.checkData(data);
    if (!checkd.status) {
      this.loading = false;
      message.error(checkd.error);
      return Promise.reject()
    }
    data.language = localStorage['community-language'];
    return DB.User.register(data).then((re)=>{
      this.loading = false;
      message.success(TextStore.text('regist_success'));
      return re;
    },e=>{
      if(!TextStore.text(e)){
        e = "Fail"
      }
      message.error(TextStore.text(e));
      this.loading = false;
      return false;
    })
    // return postData('/users/register', userData).then(result => {
    //   this.loading = false;
    //   const {ok, statusText} = result;
    //   if (ok === false) {
    //     return message.error(TextStore.text(statusText));
    //   }
    //   message.info(TextStore.text("registerSuccess"), 10)
    // });
  };

  @action
  login = (data) => {
    if (this.loading) return;
    this.loading = true;
    const checkd = this.checkData(data);
    if (!checkd.status) {
      this.loading = false;
      return message.error(checkd.error);
    }
    data.language = localStorage['community-language'];
    return DB.User.login(data).then((re)=>{
      this.loading = false;
      return re;
     },e=>{
      
      if(!TextStore.text(e)){
        e = "Fail"
      }
       message.error(TextStore.text(e));
       this.loading = false;
       return false;
     })
    
    // postData('/users/login', data).then(result => {
    //   this.loading = false;
    //   const {email, statusText, ok, username, userNick, admin, subscribe} = result;
    //   if (ok === false) return message.error(TextStore.text(statusText));
    //   runInAction(() => {
    //     this.email = email;
    //     this.init = true;
    //     this.admin = admin;
    //     this.info = {username, userNick, subscribe};
    //   });
    //   // localStorage.setItem(STORAGE_KEY, id);
    // })
  };

  @action
  changeUserNick = (userNick) => {
    // return postData('users/changeUserNick', {userNick}).then(result => {
    //   const {ok, statusText} = result;
    //   if (ok === false) {
    //     return message.error(TextStore.text(statusText))
    //   }
    //   runInAction(() => this.info.userNick = userNick);
    //   message.info(TextStore.text(result));
    // });
  }

  @action
  logout = () => {
    this.email = '';
    // putData('/users/logout').then(result => message.info(TextStore.text("logoutSuccess")))
  }

  @action
  tryLogin = () => {
    // getData('/users/status').then(result => {
    //   const {email, ok, username, admin, subscribe, userNick} = result;
    //   if (ok === false) return localStorage.removeItem(STORAGE_KEY);
    //   runInAction(() => {
    //     this.email = email;
    //     this.init = true;
    //     this.admin = admin;
    //     this.info = {username, userNick, subscribe};
    //   });
    // })
  }

  @action
  recommend = (data) => {
    if (this.loading) return;
    this.loading = true;
    const checkd = this.checkData(data);
    if (!checkd.status) {
      this.loading = false;
      message.error(checkd.error);
      return Promise.reject()
    }
    // return postData('/mail/recommend', Object.assign(data, {
    //   username: this.info.username,
    //   language: TextStore.currentLanguage
    // })).then(() => this.loading = false)
  }

  @action
  sales = (data) => {
    this.loading = true;
    data.language = TextStore.currentLanguage;
    const checkd = this.checkData(data);
    if (!checkd.status) {
      this.loading = false;
      message.error(checkd.error);
      return Promise.reject();
    }
    // return Promise.all([
    //   postData('/mail/seller', data),
    //   postData('/mail/buyer', data),
    // ])
    //   .then((result) => {
    //     const {statusText, ok} = result;
    //     this.loading = false;
    //     if (ok === false) {
    //       return message.error(TextStore.text(statusText));
    //     }
    //     message.info(TextStore.text("Sales inquiry sent successfully"))
    //   })
  }

  checkData = (data) => {
    const emailRegExp = new RegExp(/^[a-zA-Z0-9_-]+(\.([a-zA-Z0-9_-])+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/);
    const phoneRegExp = new RegExp(/^[+]?[0-9-]{4,19}$/);
    for (const key in data) {
      if (key === "email" && !emailRegExp.test(data[key])) return {status: false, error: TextStore.text("emailError")};
      if (key === 'phone' && !phoneRegExp.test(data[key])) return {status: false, error: TextStore.text('phoneError')};
      if (!data[key]) return {status: false, error: TextStore.text(key) + TextStore.text("paramsError")};
    }
    return {status: true}
  };

  // restorePassword = (old, newPassword) => {
  //   if (this.loading) return;
  //   return postData('/users/changePassword', {old, newPassword});
  // };

  forgetPassword = (email) => {
    if (this.loading) return;
    this.loading = true;
    const checkd = this.checkData({
      email,
    });
    if (!checkd.status) {
      this.loading = false;
      return message.error(checkd.error);
    }
    // data.language = localStorage['community-language'];
    return DB.User.forget({
      email,
      language:localStorage['community-language'],
      // language:'community-language'
    }).then((re)=>{
      this.loading = false;
      return re;
    },e=>{
      if(!TextStore.text(e)){
        e = "Fail"
      }
      message.error(TextStore.text(e));
      this.loading = false;
      return false;
    })
  };

  subscribe = () => {
    if (this.info.subscribe) {
      return Promise.resolve("repeat");
    }
  }
}

export default new UserStore()
