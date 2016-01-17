import {get, post} from 'jquery';

import ServerActions from './actions/ServerActions';

let API = {
  makePayment(token) {
    console.log('in api, before post');
    post('/api/charge', token).done((data) => {
      console.log('inside api, after post', data);
      ServerActions.receivePayment(data)
    });
  }
}

export default API;
