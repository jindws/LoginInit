import React, {Component} from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import {observer} from 'mobx-react';
import {observable, runInAction, toJS} from 'mobx';
import {Icon,Button} from 'antd';
import authImage from './image.png';
import logo from '../App/rsquared_logo_color.svg';
import 'antd/lib/icon/style/index.css'
import 'antd/lib/button/style/index.css'

@observer
export default class Auth extends Component {
	@observable type = this.props.type || 0;
	
	constructor(props) {
		super(props);
		if(props.Login){
			this.type = 0;
		}else if(props.Register){
			this.type = 1;
		}
	}
	
	componentDidMount() {
		setTimeout(() => {
			this.refs.auth.style.bottom = "0";
		}, 0);
	}
	
	login = () => {
		this.type = 0;
	};
	
	register = () => {
		this.type = 1;
	};
	
	forget = () => {
		this.type = 2;
	};
	
	onClose = () => {
		this.refs.auth.style.bottom = '100%';
		setTimeout(() => {
			this.props.onClose();
			this.refs.auth.style.bottom = '0';
		}, 400)
	};
	
	renderInfo = (message) => {
		switch (this.type) {
			case 0:
				return <Login
					{...this.props}
					onClose={this.onClose}
					register={this.register}
					forget={this.forget}
					UserStore={this.props.UserStore}
					TextStore={this.props.TextStore}
				/>;
			case 1:
				return <Register
					{...this.props}
					onClose={this.onClose}
					login={this.login}
					RegisterText = {message._RegisterText}
					// forget={this.forget}
					UserStore={this.props.UserStore}
					TextStore={this.props.TextStore}/>;
			case 2:
				return <Forget
					onClose={this.onClose}
					// login={this.login}
					// register={this.register}
					UserStore={this.props.UserStore}
					TextStore={this.props.TextStore}/>;
			default:
				this.onClose();
				return;
		}
	};
	
	render() {
		const {text} = this.props.TextStore;
		const {Login,Register,RegisterText} = this.props;
		const _cn = localStorage['community-language'] === 'zh-CN';
		const _RegisterText = _cn?RegisterText.cn:RegisterText.en;
		return <div className={styles.auth} ref="auth">
			<div className={styles.warp}/>
			<div className={styles.panel}>
				<div className={styles.image}>
					<img src={authImage} alt="authImage"/>
				</div>
				<div className={styles.block}>
					<div className={styles.tabs}>
						<div style={{display:(Login?'':'none')}}
							 className={classnames(styles.tab, {
							[styles.active]: this.type === 0
						})} onClick={this.login}>
							{text('signIn')}
						</div>
						<div style={{display:(Register?'':'none')}}
							 className={classnames(styles.tab, {
							[styles.active]: this.type === 1
						})} onClick={this.register}>{_RegisterText||text('createAccount')}</div>
						<Button
							onClick={this.onClose}
							size = 'small'
							type="danger"
							shape="circle"
							icon="close" />
					</div>
					{this.renderInfo({
						_RegisterText,
					})}
				</div>
			</div>
		</div>
	}
}

@observer
class Login extends Component {
	@observable email = '';
	@observable password = '';
	
	constructor(props){
		super(props);
		this.login = this.login.bind(this)
	}
	
	emailChange = e => {
		this.email = e.target.value;
	};
	
	passwordChange = e => {
		this.password = e.target.value;
	};
	
	async login(){
		const result = await this.props.UserStore.login({
			email: this.email,
			password: this.password
		});
		
		if(result&&result!==true){
			this.props.LoginSuccess(result);
		}
	};
	
	forget = () => {
		this.props.forget();
	};
	
	onEnterKeyPress = e => {
		if (e.charCode === 13) {
			this.login()
		}
	};
	
	render() {
		const {text} = this.props.TextStore;
		return <div className={styles.info}>
			<div className={styles.back} onClick={this.props.onClose}><Icon type="close"/></div>
			<div className={styles.logo}>
				<img src={logo} alt="logo"/>
			</div>
			<div className={styles.inputBox}>
				<div className={styles.input}>
					<input placeholder={`${text("email")}`} value={this.email} onKeyPress={this.onEnterKeyPress}
						   onChange={this.emailChange}/>
				</div>
				<div className={styles.input}>
					<input type="password" placeholder={text("password")} value={this.password} onKeyPress={this.onEnterKeyPress}
						   onChange={this.passwordChange}/>
				</div>
				<div className={styles.textBox} style={{display:(this.props.Login&&this.props.Login.forget?'':'none')}}>
					<div className={classnames(styles.text, styles.reg)}
						 onClick={this.props.register}>{text("createAccount")}</div>
					<div className={styles.text} onClick={this.forget}>{text("auth.forget")}?</div>
				</div>
			</div>
			<Button
				className={styles.button}
				onClick={this.login}
				type="primary"
				loading = {this.loading}>
				{text("login")}
			</Button>
		</div>
	}
}

@observer
class Register extends Component {
	@observable showIndustry = false;
	@observable showCountry = false;
	@observable loading = false;
	@observable tuple = {};
	
	@observable show = {};
	
	setProperty = (key, value) => {
		this.tuple[key] = value;
	};
	
	handleChange = (key, e) => {
		this.setProperty(key, e.target.value)
	};
	
	register = () => {
		runInAction(() => this.loading = true);
		const {TextStore, UserStore} = this.props;
		UserStore.register({...this.tuple, language: TextStore.currentLanguage}).then(result => {
			runInAction(() => this.loading = false);
			if(result){
				this.props.login()
			}
		}, () => {
			runInAction(() => this.loading = false)
		})
	};
	
	render() {
		const {text} = this.props.TextStore;
		const Register = Object.entries(this.props.Register);
		const _cn = localStorage['community-language'] === 'zh-CN';
		
		let patterns = true;
		
		Register.forEach(itm=>{
			const {pattern} = itm[1];
			if(pattern){
				const name = itm[0];
				const _name = this.tuple[name]||'';
				const result = pattern.test(_name)
				if(!result){
					patterns = false;
				}
			}
		});
		
		
		return <div className={styles.info}>
			<div className={styles.back} onClick={this.props.login}><Icon type="left"/></div>
			<div className={styles.logo}>
				<img src={logo} alt="logo"/>
			</div>
			<div className={styles.inputBox}>
				{
					Register.map(itm=>{
						const name = itm[0];
						const {list,cn,en,pattern} = itm[1];
						
						const placeholder = _cn?cn:en;
						if(list){
							const _name = this.tuple[name]||'';
							const display_name = _cn?_name[1]:_name[0];
							const value = toJS(this.tuple[name]);
							return <div className={styles.input} key={name}>
								<i style={{display:(itm[1].pattern?'':'none')}}>*</i>
								<input placeholder={placeholder}
									   defaultValue={display_name}
									   readOnly={true}
									   onClick={() => this.show[name] = true}/>
								<div className={styles.arrowDown} onClick={() => this.show[name] = true}>
									<Icon type="caret-down" theme="outlined"/>
								</div>
								<SelectBox
									visible={!!this.show[name]}
									list={list}
									other={true}
									col={4}
									value={value}
									onClose={() => this.show[name] = false}
									onChange={(itm)=>{
									   this.tuple[name] = itm
								    }}
									text={text}/>
							</div>
						}
						return <div key={name} className={styles.input}>
								<i style={{display:(pattern?'':'none')}}>*</i>
								<input placeholder={placeholder||itm[0]} value={this.tuple[name]||''}
									  onChange={this.handleChange.bind(this, name)}/>
						</div>
					})
				}
			</div>
			<Button
				className={styles.button}
				onClick={this.register}
				type="primary"
				disabled = {!patterns}
				loading = {this.loading}>
				{this.props.RegisterText||text("submit")}
			</Button>
		</div>
	}
}

@observer
class Forget extends Component {
	
	async forget(){
		const result = await this.props.UserStore.forgetPassword(this.email);
		
		if(result&&result!==true){
			// this.props.ForgetSuccess(result);
			console.log(this.props)
			this.props.onClose()
		}
	};
	
	render() {
		const {text} = this.props.TextStore;
		return <div className={styles.info}>
			<div className={styles.close} onClick={this.props.onClose}><Icon type="close"/></div>
			<div className={styles.back} onClick={this.props.login}><Icon type="left"/></div>
			<div className={styles.logo}>
				<img src={logo} alt="logo"/>
			</div>
			<div className={styles.inputBox}>
				<div className={styles.input}>
					<input onChange={(e)=>{
						this.email = e.target.value;
					}}
					value={this.email} placeholder={text('forgetPassword')}/>
				</div>
			</div>
			<Button
				className={styles.button}
				onClick={this.forget.bind(this)}
				type="primary"
				loading = {this.loading}>
				{text("rsubmit")}
			</Button>
		</div>
	}
}

@observer
class SelectBox extends Component {
	@observable text = "";
	@observable isOther = !!this.props.value && !this.props.list.includes(this.props.value);
	
	handleChange = value => {
		this.isOther = false;
		this.props.onChange(value)
	};
	
	handleInput = e => {
		if (this.text.length > 20) return;
		this.text = e.target.value;
		if (this.isOther) {
			this.props.onChange([this.text,this.text]);
		}
	};
	
	other = () => {
		this.isOther = true;
		this.props.onChange(this.text)
	};
	
	render() {
		const {visible, list, value=[], other, col, onClose, text} = this.props;
		const radioStyle = {width: (100 / col) + "%"};
		const _list = Object.entries(list);
		const _cn = localStorage['community-language'] === "zh-CN";
		return visible && <div className={styles.selectBox}>
			<div className={styles.selectWarp} onClick={onClose}/>
			<div className={styles.selectBlock}>
				<div className={styles.radioBox}>
					{
						_list.map((itm=[],index)=>{
							const name = _cn?itm[1]:itm[0];
							return <div className={styles.radioBlock} style={radioStyle} key={index}>
								<input id={'reg_value' + index} type="radio" name='regRadio' onChange={this.handleChange.bind(this,itm)}
									   checked={itm[0]=== value[0]}/>
								<label>{name}</label>
							</div>
						})
					}
				</div>
				{other && <div className={styles.otherBox}>
					<div className={styles.radioBlock}>
						<input id='reg_other' type="radio" name='regRadio' onChange={this.other} checked={this.isOther}/>
						<label htmlFor='reg_other'>{text('other')}</label>
					</div>
					<div className={styles.otherInput}>
						<input value={this.text} onChange={this.handleInput}/>
					</div>
				</div>}
				<div className={styles.selectConfirm} onClick={onClose}>{text('confirm')}</div>
			</div>
		</div>
	}
}
