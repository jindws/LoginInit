import _ from 'lodash'
import {fetch} from 'whatwg-fetch'

const qs = require('querystring');

const fetchData = (url, options) => {
  return fetch(url, options).then(checkStatus).then(parseType).catch(err => err);
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return Promise.reject(response);
};

const parseType = (response) => {
  const contentType = response.headers.get('content-type');
  return contentType.includes('application/json') ? response.json() : response.text();
};

const baseOptions = {
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  mode: 'cors', // no-cors, cors, *same-origin
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // *client, no-referrer
};

const getData = (url, params) => {
  let queryStr = qs.encode(params);
  url = queryStr ? url + '?' + queryStr : url;
  let options = _.assign({
    method: 'GET',
    headers: {'Content-Type': 'text/plain'},
  });
  return fetchData(url, options);
};

const postData = (url, data) => {
  let options = _.assign({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }, baseOptions);
  return fetchData(url, options);
};

const putData = (url, data) => {
  let options = _.assign({
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }, baseOptions);
  return fetchData(url, options);
};

const deleteData = (url, data) => {
  let options = _.assign({
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }, baseOptions);
  return fetchData(url, options);
};

export {
  getData,
  postData,
  putData,
  deleteData
}
