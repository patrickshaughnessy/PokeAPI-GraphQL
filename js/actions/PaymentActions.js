import API from '../API';

let PaymentActions = {
  makePayment(token){
    API.makePayment(token);
  }
}

export default PaymentActions;
