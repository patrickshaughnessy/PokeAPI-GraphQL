import {EventEmitter} from 'events';
import AppDispatcher from '../AppDispatcher';
import {ActionTypes} from '../Constants';

let _payment;

class PaymentStore extends EventEmitter {
  // register with Dispatcher
  constructor(props){
    super(props);

    AppDispatcher.register(action => {
      switch (action.actionType) {
        case ActionTypes.RECEIVE_PAYMENT:
        console.log('inside store', action.charge);
          _payment = action.charge
          this.emit('CHANGE');
          break
      }
    })
  }

  // expose some data
  returnConfirmation() {
    return _payment;
  }

  // listen
  startListening(cb) {
    this.on('CHANGE', cb);
  }
  stopListening(cb) {
    this.removeListener('CHANGE', cb);
  }
}

export default new PaymentStore();
