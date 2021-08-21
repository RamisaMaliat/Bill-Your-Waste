import React, { Component } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";
import { logout } from "../login/LoginActions";
import { toast } from "react-toastify";


class CreateMerchant extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            name: "",
            contact: "",
            type: ""
        };
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

        fetch(process.env.REACT_APP_API + 'merchant/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + usertoken

            },
            body: JSON.stringify({
                'name': event.target.name.value,
                'contact': event.target.contact.value,
                'type': event.target.type.value
            })
        })
            .then(res => res.json())
            .then((result) => {
                if (result == true) { 
                    if(this.state.type == 'bkash') this.props.history.push('/bkash'); 
                    else if(this.state.type == 'nagad') this.props.history.push('/nagad'); 
                    else this.props.history.push('/bank-account'); 
                }
                else toast.error("Error Occurred!", { position: "top-center" });
            },
                (error) => {
                    toast.error("Error Occurred!", { position: "top-center" });
                })

    }

    render() {
        const { user } = this.props.auth;
        return (
            <div class="center-block " style={{ "maxWidth": "500px", "padding": "10px", "marginTop": "30px", backgroundColor: "#ecffe6" }}>
                <div class="mt-4 mb-4 mx-auto rounded pt-4 " style={{ backgroundColor: "#ecffe6" }} >
                    <div class="text-center col log-in-div" style={{ backgroundColor: "#ecffe6" }} >
                        <img
                            src="CleanBD-logo.png" alt="CleanBD-logo"
                            id="log-in-img" style={{ height: "150px" }} />
                        <h3 class="green-text"><b>Your Information</b></h3>
                        <hr />
                    </div>

                    <Form class="log-in-form" onSubmit={this.handleSubmit}>
                        <Form.Group controlId="nameId">
                            <Form.Label>Name <label style={{ color: "gray" }}>(You can update it later)</label></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={this.state.name}
                                onChange={this.onChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="contactId">
                            <Form.Label>Contact number <label style={{ color: "gray" }}>(You can update it later)</label></Form.Label>
                            <Form.Control
                                type="text"
                                name="contact"
                                placeholder="Enter your contact number"
                                value={this.state.contact}
                                onChange={this.onChange}
                                required
                            />
                        </Form.Group>

                        <label>Select your payment method <label style={{ color: "gray" }}>(You can update it later)</label> </label>
                        <div class="checkbox mb-3 inline" style={{ paddingBottom: "20px" }}>

                            <label class="type" style={{ marginTop: "0px" }} >
                                <input type="radio" style={{ marginTop: "0px" }} value="bkash" name="type" onChange={this.onChange} required /> Bkash
                            </label>
                            <label class="type" style={{ marginTop: "0px" }} >
                                <input type="radio" style={{ marginTop: "0px" }} value="nagad" name="type" onChange={this.onChange} required /> Nagad
                            </label>
                            <label class="type" style={{ marginTop: "0px" }} >
                                <input type="radio" style={{ marginTop: "0px" }} value="bank" name="type" onChange={this.onChange} required /> Bank account
                            </label>
                        </div>

                        <Button className="btn btn-success " style={{ "color": "white", fontSize: "15px" }} type="submit" >
                            Submit
                        </Button>


                    </Form>
                </div>
            </div>

        );


    }
}

CreateMerchant.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logout
})(withRouter(CreateMerchant));