import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'

class Demo extends Component {
	constructor(props){
		super(props);
		this.state = {
			show:true
		}
	}
	
	onClose(){
		this.setState({
			show:false,
		})
	}
	
	render() {
		const {show} = this.state;
		return <div>
			<Example
				Login = {{
					forget:true,
				}}
				LoginSuccess = {(message)=>{
						console.log(message);
						this.setState({
							show:false,
						})
					}
				}
				RegisterText = {{
					cn:'申请试用',
					en:'Trial',
				}}
				Register = {{
					email:{
						cn:'公司邮箱',
						en:'Company Email',
						pattern:/^[a-zA-Z0-9_-]+(\.([a-zA-Z0-9_-])+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
					},
					userName:{
						cn:'用户姓名',
						en:'User name',
						pattern:/^[\s\S]*.*[^\s][\s\S]*$/,
					},
					companyName:{
						cn:'公司名称',
						en:'Company name',
					},
					industry:{
						cn:'所处行业',
						en:'Industry',
						pattern:/^[\s\S]*.*[^\s][\s\S]*$/,
						list:{
							Medical:'医疗',
							Medical2:'医疗2',
						}
					}
				}}
				show = {show}
				onClose={this.onClose.bind(this)}
			/>
		</div>
	}
}

render(<Demo/>, document.querySelector('#demo'));
