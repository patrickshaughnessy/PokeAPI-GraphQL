import React from "react";
import Relay from 'react-relay'

import PaymentActions from '../actions/PaymentActions';
import PaymentStore from '../stores/PaymentStore';

let _returnConfirmation = () => {
  return { charge: PaymentStore.returnConfirmation()}
}

class Purchase extends React.Component{
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
    console.log('5. store emitted change event', this.props.spoon._id, _returnConfirmation());
    let chargeId = _returnConfirmation().charge.productId;
    if (this.props.spoon._id === chargeId){
      return this.setState(_returnConfirmation());
    }
  }

  handleClick(spoon, e){
    e.preventDefault();
    var productId = spoon._id;
    var amount = spoon.price;
    var name = spoon.title;
    var description = spoon.description;

    // it opens below this definition - bitches
    var handler = StripeCheckout.configure({
      key: 'pk_test_XsChXUjkE5asWIozOmwkZRx6',
      image: spoon.image,
      locale: 'auto',
      token: function(token) {
        // Use the token to create the charge with a server-side script.
        token.productId = productId;
        token.amount = amount;
        PaymentActions.makePayment(token);
      }
    });

    // Open Checkout with further options
    handler.open({
      name: name,
      description: description,
      amount: amount
    });

  }
  render(){
    let {title, price, _id} = this.props.spoon

    var paymentConfirmation = this.state.charge;

    if (paymentConfirmation){
      return(
        <div className="purchase">
          <h3>Thank You!</h3>
          <h4>Your payment of ${price} for {title} has been completed successfully</h4>
        </div>
      )
    } else {
      return(
        <div className="purchase">
          <button onClick={this.handleClick.bind(this, this.props.spoon)}>Purchase</button>
        </div>
      )
    }

  }
}

export default Purchase;
