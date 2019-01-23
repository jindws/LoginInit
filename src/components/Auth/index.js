import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import classnames from 'classnames';
import styles from './styles.module.scss';
import {observer} from 'mobx-react';
import {observable, when, runInAction, toJS} from 'mobx';
import {Icon,Button} from 'antd';
import authImage from './image.png';
import logo from '../App/rsquared_logo_color.svg';
import 'antd/lib/icon/style/index.css'
import 'antd/lib/button/style/index.css'

// export default ({...args}) => {
// 	const body = document.body;
// 	const html = document.documentElement;
// 	const div = document.createElement('div');
// 	const topDom = html.scrollTop ? html : body;
// 	const top = topDom.scrollTop;
//
// 	const init = () => {
// 		body.appendChild(div);
// 		body.style.overflow = 'hidden';
// 		html.style.overflow = "hidden";
// 		topDom.scrollTop = 0;
// 	};
//
// 	const close = () => {
// 		body.style.overflow = '';
// 		html.style.overflow = "";
// 		topDom.scrollTop = top;
// 		try {
// 			document.body.removeChild(div);
// 		} catch (e) {
//
// 		}
// 	};
//
// 	init();
//
// 	console.log(129,this)
//
// 	return ReactDOM.render(<Auth {...Object.assign(args, {close})} />, div)
// }


@observer
export default class Auth extends Component {
	@observable type = this.props.type || 0;
	
	constructor(props) {
		super(props);
		// when(
		// 	() => this.props.UserStore.email,
		// 	() => this.onClose()
		// );
		
		// if (this.props.isRegist) {
		// 	this.register()
		// } else {
		// 	this.login()
		// }
		
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
		// const {onClose, close} = this.props;
		this.refs.auth.style.bottom = '100%';
		setTimeout(() => {
			// if (onClose && typeof onClose === 'function') onClose();
			// if (close && typeof close === 'function') close();
			this.props.onClose();
			this.refs.auth.style.bottom = '0';
		}, 400)
	};
	
	renderInfo = () => {
		switch (this.type) {
			case 0:
				return <Login
					{...this.props}
					onClose={this.onClose}
					register={this.register}
					forget={this.forget}
					UserStore={this.props.UserStore}
					TextStore={this.props.TextStore}
					// push={this.props.push}
				/>;
			case 1:
				return <Register
					{...this.props}
					onClose={this.onClose}
					login={this.login}
					forget={this.forget}
					UserStore={this.props.UserStore}
					TextStore={this.props.TextStore}/>;
			case 2:
				return <Forget
					onClose={this.onClose}
					login={this.login}
					register={this.register}
					TextStore={this.props.TextStore}/>;
			default:
				this.onClose();
				return;
		}
	};
	
	render() {
		const {text} = this.props.TextStore;
		const {Login,Register} = this.props;
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
						})} onClick={this.register}>{text('createAccount')}</div>
						<Button
							onClick={this.onClose}
							size = 'small'
							type="danger"
							shape="circle"
							icon="close" />
					</div>
					{this.renderInfo()}
				</div>
			</div>
		</div>
	}
}

@observer
class Login extends Component {
	@observable email = '';
	@observable password = '';
	
	emailChange = e => {
		this.email = e.target.value;
	};
	
	passwordChange = e => {
		this.password = e.target.value;
	};
	
	login = () => {
		this.props.UserStore.login({
			email: this.email,
			password: this.password
		});
	};
	
	forget = () => {
		// this.props.onClose();
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
			{/*<div className={styles.close} onClick={this.props.onClose}><Icon type="close"/></div>*/}
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
				<div className={styles.textBox} style={{display:(this.props.Login.forget?'':'none')}}>
					<div className={classnames(styles.text, styles.reg)}
						 onClick={this.props.register}>{text("createAccount")}</div>
					<div className={styles.text} onClick={this.forget}>{text("auth.forget")}?</div>
				</div>
			</div>
			<div className={styles.button} onClick={this.login}>{text("login")}</div>
		</div>
	}
}

@observer
class Register extends Component {
	@observable showIndustry = false;
	@observable showCountry = false;
	@observable loading = false;
	@observable tuple = {
		companyEmail: '',
		userName: '',
		companyName: '',
		industry: '',
		department: '',
		telephone: '',
		country: ''
	};
	
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
		UserStore.register({...this.tuple, language: TextStore.currentLanguage}).then(() => {
			runInAction(() => this.loading = false);
			this.props.login()
		}, () => {
			runInAction(() => this.loading = false)
		})
	};
	
	render() {
		const {loading} = this.props.UserStore;
		const {text} = this.props.TextStore;
		const Register = Object.entries(this.props.Register);
		// const industryList = [
		// 	text('industry.medical'),
		// 	text('industry.insurance'),
		// 	text('industry.automobile'),
		// 	text('industry.finance'),
		// 	text('industry.pharmacy'),
		// 	text('industry.environmental'),
		// 	text('industry.telecommunication'),
		// 	text('industry.energy')
		// ];
		// const countryList = [
		// 	text('country.china'),
		// 	text('country.us')
		// ];
		const _cn = localStorage['community-language'] === 'zh-CN';
		return <div className={styles.info}>
			<div className={styles.back} onClick={this.props.login}><Icon type="left"/></div>
			<div className={styles.logo}>
				<img src={logo} alt="logo"/>
			</div>
			<div className={styles.inputBox}>
				{
					Register.map(itm=>{
						const name = itm[0];
						const {list,cn,en} = itm[1];
						
						const placeholder = _cn?cn:en;
						// console.log(list,industryList);
						if(list){
							// console.log(1,this.tuple,this.tuple[name])
							const _name = this.tuple[name];
							const display_name = _cn?_name[1]:_name[0];
							const value = toJS(this.tuple[name]);
							return <div className={styles.input} key={name}>
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
						return <div key={name}
									className={styles.input}>
								<input placeholder={placeholder||itm[0]} value={this.tuple[name]}
									  onChange={this.handleChange.bind(null, name)}/>
						</div>
					})
				}
				
				{/*<div className={styles.input}>*/}
					{/*<input placeholder={text("industry")} defaultValue={this.tuple.industry} readOnly={true}*/}
						   {/*onClick={() => this.showIndustry = true}/>*/}
					{/*<div className={styles.arrowDown} onClick={() => this.showIndustry = true}><Icon type="caret-down"*/}
																									 {/*theme="outlined"/></div>*/}
					{/*<SelectBox visible={this.showIndustry} list={industryList} other={true} col={4} value={this.tuple.industry}*/}
							   {/*onClose={() => this.showIndustry = false} onChange={this.setProperty.bind(null, 'industry')}*/}
							   {/*text={text}/>*/}
				{/*</div>*/}
				{/*<div className={styles.input}>*/}
					{/*<input placeholder={text("country")} defaultValue={this.tuple.country} readOnly={true}*/}
						   {/*onClick={() => this.showCountry = true}/>*/}
					{/*<div className={styles.arrowDown} onClick={() => this.showCountry = true}><Icon type="caret-down"*/}
																									{/*theme="outlined"/></div>*/}
					{/*<SelectBox visible={this.showCountry} list={countryList} other={true} col={2} value={this.tuple.country}*/}
							   {/*onClose={() => this.showCountry = false} onChange={this.setProperty.bind(null, 'country')}*/}
							   {/*text={text}/>*/}
				{/*</div>*/}
			</div>
			<div className={styles.button} onClick={loading && this.loading ? null : this.register}>{this.loading ?
				<Icon type='loading'/> : text("submit")}</div>
		</div>
	}
}

@observer
class Forget extends Component {
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
					<input placeholder={text('forgetPassword')}/>
				</div>
			</div>
			<div className={styles.button}>提交</div>
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
		const {visible, list, value, other, col, onClose, text} = this.props;
		const radioStyle = {width: (100 / col) + "%"};
		const _list = Object.entries(list);
		const _cn = localStorage['community-language'] === "zh-CN";
		return visible && <div className={styles.selectBox}>
			<div className={styles.selectWarp} onClick={onClose}/>
			<div className={styles.selectBlock}>
				<div className={styles.radioBox}>
					{
						_list.map((itm,index)=>{
							const name = _cn?itm[1]:itm[0];
							console.log(value,itm,name)
							return <div className={styles.radioBlock} style={radioStyle} key={index}>
								<input id={'reg_value' + index} type="radio" name='regRadio' onChange={this.handleChange.bind(this,itm)}
									   checked={itm[0]=== value[0]}/>
								<label>{name}</label>
							</div>
						})
					}
					{/*{list.map((v, k) => {*/}
						{/*return <div className={styles.radioBlock} style={radioStyle} key={k}>*/}
							{/*<input id={'reg_value' + k} type="radio" name='regRadio' onChange={this.handleChange.bind(null, v)}*/}
								   {/*checked={v === value}/>*/}
							{/*<label htmlFor={'reg_value' + k}>{v}</label>*/}
						{/*</div>*/}
					{/*})}*/}
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
