import AppDispatcher from '../AppDispatcher';
import {ActionTypes} from '../Constants';

let ServerActions = {
  receivePayment(charge) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.RECEIVE_PAYMENT,
      charge
    });
  }
}

export default ServerActions;
