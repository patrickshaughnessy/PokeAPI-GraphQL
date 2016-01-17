
import React from "react";
import Relay from 'react-relay';

import PurchaseAllItems from './PurchaseAllItems'

class ShoppingCart extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: localStorage.items ? JSON.parse(localStorage.items) : []
    }
  }

  render(){
    console.log('items', this.state.items);
    let items = this.state.items;
    let totalItems = items.length;
    let totalCost = items.reduce((a, item) => {
      console.log(a, item);
      return a + Number(item.price)
    }, 0)
    return(
      <div className="shoppingCart well">
        <h3>Total Items: {totalItems}</h3>
        <h3>Total Cost: {totalCost}</h3>
        <PurchaseAllItems id='allspoons' amount={totalCost} />
      </div>
    )
  }
}

export default ShoppingCart;
