import DBF from 'dbfac'

DBF.requestHead = 'http://localhost:8001';
DBF.dataType = 'text';

DBF.create('User', {
	login:{
		url       :'/', //请求地址
	},
	register:{
		url       :'/',
		method    :'POST',
	},
	forget:{
		url       :'/',
		method    :'PUT',
	}
});

export default DBF
