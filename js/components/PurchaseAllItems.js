import React from "react";
import Relay from 'react-relay'

import PaymentActions from '../actions/PaymentActions';
import PaymentStore from '../stores/PaymentStore';

let _returnConfirmation = () => {
  return { charge: PaymentStore.returnConfirmation()}
}

class PurchaseAllItems extends React.Component{
  constructor(props){
    super(props);
    this.state = _returnConfirmation();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount(){
    PaymentStore.startListening(this._onChange);
  }

  componentWillUnmount(){
    PaymentStore.stopListening(this._onChange);
  }

  _onChange() {
    console.log('5. store emitted change event');
    let chargeId = _returnConfirmation().charge.productId;
    if (chargeId === 'allspoons'){
      localStorage.setItem('items', '');
      setTimeout(() => {
        location = location
      }, 5);
      return this.setState(_returnConfirmation());
    }
  }

  handleClick(amount, e){
    e.preventDefault();
    var productId = 'allspoons'
    // it opens below this definition - bitches
    var handler = StripeCheckout.configure({
      key: 'pk_test_XsChXUjkE5asWIozOmwkZRx6',
      image: 'http://i0.kym-cdn.com/entries/icons/original/000/001/013/iamabananawd7.jpg',
      locale: 'auto',
      token: function(token) {
        // Use the token to create the charge with a server-side script.
        token.amount = amount;
        token.productId = productId
        PaymentActions.makePayment(token);
      }
    });

    // Open Checkout with further options
    handler.open({
      name: 'Spoons',
      description: 'My spoon is too big',
      amount: amount
    });

  }
  render(){

    var paymentConfirmation = this.state.charge;

    if (paymentConfirmation){
      return(
        <div className="purchase">
          <h3>Thank You!</h3>
        </div>
      )
    } else {
      return(
        <div className="purchase">
          <button onClick={this.handleClick.bind(this, this.props.amount)}>Purchase All Items</button>
        </div>
      )
    }

  }
}

export default PurchaseAllItems;
