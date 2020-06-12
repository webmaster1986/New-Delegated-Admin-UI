import React, { Component, Fragment } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Router from './Router';
import Register from "../Register/Register";
import Logout from "../Logout";
import store from './store';
import ScrollToTop from './ScrollToTop';
import 'antd/dist/antd.css';
import '../../scss/app.scss';
import './App.scss'
import '../Home/Home.scss';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename={"/iga"}>
        <ScrollToTop>
          <Fragment>
              <div>
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/:clientId" component={Router} />
                </Switch>
              </div>
          </Fragment>
        </ScrollToTop>
      </BrowserRouter>
    </Provider>
  );
}

export default hot(module)(App);
