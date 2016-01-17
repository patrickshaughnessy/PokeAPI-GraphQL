import 'babel/polyfill';

import AppController from "./components/AppController";
import AppControllerRoute from './routes/AppControllerRoute'
import React from "react";
import ReactDOM from "react-dom";
import Relay from 'react-relay';

ReactDOM.render(
  <Relay.RootContainer
    Component={AppController}
    route={new AppControllerRoute()}
  />,
  document.getElementById("react")
);
