
import Relay from 'react-relay';

export default class extends Relay.Route {
  static path = '/';
  static queries = {
    store: () => Relay.QL`query { store }`,
  };
  static routeName = 'AppControllerRoute';
}
