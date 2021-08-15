import React, { Component } from 'react';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";
import { logout } from "./login/LoginActions";
import { toast } from "react-toastify";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class TakeService extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            title: "",
            description: "",
            amount: "",
            category: "",
            price: "",
            address: "",
            path: window.location.pathname,
            catageoryid: ""
        };
    }

    fetchData() {
        let usertoken = localStorage.getItem("token");
        fetch(process.env.REACT_APP_API + 'merchant/getCategory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + usertoken

            },
            body: JSON.stringify({
                'path': this.state.path
            })
        })
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    category: result[0].CategoryName,
                    categoryid: result[0].CategoryID,
                    price: result[0].SellPrice
                });

                console.log(result);
            },
                (error) => {
                    toast.error("Error Occurred!", { position: "top-center" });
                })
    }

    componentDidMount() {
        this.fetchData();
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value,

        });
    }

    onLogout = () => {
        this.props.logout();
    };

    handleSubmit(event) {
        event.preventDefault();
        let usertoken = localStorage.getItem("token");

        fetch(process.env.REACT_APP_API + 'merchant/sell', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + usertoken

            },
            body: JSON.stringify({
                'title': event.target.title.value,
                'description': event.target.description.value,
                'amount': event.target.amount.value,
                'category': this.state.categoryid,
                'address': event.target.address.value
            })
        })
            .then(res => res.json())
            .then((result) => {
                if (result == true) {
                    this.props.history.push('/not-collected');    
                    toast.info("We will pick the wastes tomorrow between 10 am to 12 pm from your address. We will contact through your contact number or email address if necessary. You will receive your dues at the end of this month through the provided payment method for your account (if you want you can update it anytime). Contact us if you have any query. Thank you for being with us!", 
                    { position: "top-center", autoClose:false });               
                }
                else toast.error("Error Occurred! Try again!", { position: "top-center"});
                
            },
                (error) => {
                    toast.error("Error Occurred! Try again!", { position: "top-center" });
                })
    }

    render() {
        const { user } = this.props.auth;
        const { category } = this.state;
        const { price } = this.state;
        
        return (
            <div class="center-block " style={{ "maxWidth": "1000px", "padding": "10px", "marginTop": "30px", backgroundColor: "#ecffe6" }}>
                <div class="mt-4 mb-4 mx-auto rounded pt-4 " style={{ backgroundColor: "#ecffe6" }} >
                    <div class="text-center col log-in-div" style={{ backgroundColor: "#ecffe6", "marginTop": "0px" }} >
                        <img
                            src="CleanBD-logo.png" alt="CleanBD-logo"
                            id="log-in-img" style={{ height: "100px" }} />
                        <h3 class="green-text"><b>Information</b></h3>
                        <h4 ><b>{"Category : "}{category}</b></h4>
                        <hr />
                    </div>

                    <Form class="log-in-form" onSubmit={this.handleSubmit}>
                        <Form.Group controlId="titleId">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter a title"
                                value={this.state.title}
                                onChange={this.onChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="descId">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={5}
                                placeholder="Enter a short description about the waste metarials that you want to send"
                                value={this.state.description}
                                onChange={this.onChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="amountId">
                            <Form.Label>Amount of wastes (in grams)</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                placeholder="Enter the amount of waste you want to send"
                                value={this.state.amount}
                                onChange={this.onChange}
                                required
                            />
                            <p style={{ "fontSize": "15px" }}>{"(You will receive "}<random style={{ "color": "green" }}><u>{price}{" taka / gram"}</u></random>{" waste)"}</p>
                        </Form.Group>

                        <Form.Group controlId="addressId">
                            <Form.Label>Full address</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="address"
                                rows={2}
                                placeholder="Where to pick from"
                                value={this.state.address}
                                onChange={this.onChange}
                                required
                            />
                        </Form.Group>

                        <Button className="btn btn-success " style={{ "color": "white", fontSize: "15px" }} type="submit" >
                            Submit
                        </Button>

                    </Form>
                </div>
            </div>
        );

    }
}

TakeService.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logout
})(withRouter(TakeService));