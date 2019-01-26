import DBF from 'dbfac'

// DBF.requestHead = 'http://localhost:8001';
DBF.dataType = 'text';

DBF.create('User', {
	login:{
		url       :'/login', //请求地址
		method    :'PUT',
	},
	register:{
		url       :'/login',
		method    :'POST',
	},
	forget:{
		url       :'/login',
		method    :'PATCH',
	}
});

export default DBF
