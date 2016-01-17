import React from "react";
import Relay from 'react-relay';

import Purchase from './Purchase';
import AddToCart from './AddToCart';

class Item extends React.Component{
  render(){
    let {title, description, price, mood, type, image} = this.props.spoon
    return(
      <div className="item col-xs-4">
        <div className="thumbnail">
          <img src={image}></img>
            <div className="caption">
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>
                <li>Type: {type}</li>
                <li>Mood: {mood}</li>
              </ul>
              <h4>Price: ${price}</h4>
              <Purchase spoon={this.props.spoon} />
              <AddToCart spoon={this.props.spoon} />
            </div>
        </div>
      </div>
    )
  }
}

export default Item;
