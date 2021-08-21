import React, { Component } from "react";
import Root from "./Root";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import tokenRequired from "./utils/Authorization";
import Home from "./components/Home";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import CreateMerchant from "./components/signup/CreateMerchant";
import Bkash from "./components/payment/Bkash";
import Nagad from "./components/payment/Nagad";
import Bankacc from "./components/payment/Bankacc";
import NotCollected from "./components/dashboard/NotCollected";
import Collected from "./components/dashboard/Collected";
import AskCategory from "./components/AskCategory";
import TakeService from "./components/TakeService";
import MerchantAccount from "./components/MerchantAccount";
import CreateConsumer from "./components/signup/CreateConsumer";
import NotReceived from "./components/dashboard/NotReceived";
import Received from "./components/dashboard/Received";
import ConsumerAccount from "./components/ConsumerAccount";
import PlaceOrder from "./components/PlaceOrder";
import PlaceYourOrder from "./components/PlaceYourOrder";
import ConfirmOrder from "./components/ConfirmOrder";
import LoggedHome from "./components/LoggedHome";


if (window.location.origin === "http://localhost:3000") {
  axios.defaults.baseURL = "http://127.0.0.1:8000";
} else {
  axios.defaults.baseURL = window.location.origin;
}

class App extends Component {
  render() {
    return ( 
      <div className="App" >
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
          integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous"></link>
          
        <Root>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/logged-in-home" component={tokenRequired(LoggedHome)} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/bkash" component={tokenRequired(Bkash)} />
            <Route path="/nagad" component={tokenRequired(Nagad)} />
            <Route path="/bank-account" component={tokenRequired(Bankacc)} />
            <Route path="/not-collected" component={tokenRequired(NotCollected)} />
            <Route path="/collected" component={tokenRequired(Collected)} />
            <Route path="/not-received" component={tokenRequired(NotReceived)} />
            <Route path="/received" component={tokenRequired(Received)} />
            <Route path="/merchant" component={tokenRequired(CreateMerchant)} />
            <Route path="/consumer" component={tokenRequired(CreateConsumer)} />
            <Route path="/ask-category" component={tokenRequired(AskCategory)} />
            <Route path="/place-order" component={tokenRequired(PlaceOrder)} />
            <Route path="/place-order:Id" component={tokenRequired(PlaceYourOrder)} />
            <Route path="/take-service:Id" component={tokenRequired(TakeService)} />
            <Route path="/merchant-account" component={tokenRequired(MerchantAccount)} />
            <Route path="/consumer-account" component={tokenRequired(ConsumerAccount)} />
            <Route path="/:Id" component={tokenRequired(ConfirmOrder)} />
            
            
          </Switch>
        </Root>
        <ToastContainer hideProgressBar={true} newestOnTop={true} />
      </div>
      
    );
  }
}

export default App;
