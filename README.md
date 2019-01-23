# LoginInit

### React Component
```
import LoginInit from 'LoginInit'

-
<LoginInit
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
				Register = {{
					email:{
						cn:'公司邮箱',
						en:'Company Email',
						// required:true,
					},
					userName:{
						cn:'用户姓名',
						en:'User name',
						// required:true,
					},
					companyName:{
						cn:'公司名称',
						en:'Company name',
						// required:true,
					},
					industry:{
						cn:'所处行业',
						en:'Industry',
						// required:true,
						list:{
							Medical:'医疗',
							Medical2:'医疗2',
						}
					}
				}}
				show = {show}
				onClose={this.onClose.bind(this)}
			/>
```
