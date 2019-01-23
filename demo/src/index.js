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
				Register = {{
					email:{
						cn:'公司邮箱',
						en:'Company Email',
						required:true,
					},
					userName:{
						cn:'用户姓名',
						en:'User name',
						required:true,
					},
					companyName:{
						cn:'公司名称',
						en:'Company name',
						required:true,
					},
					industry:{
						cn:'所处行业',
						en:'Industry',
						required:true,
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
