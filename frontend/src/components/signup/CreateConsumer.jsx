import React, { Component } from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";
import { logout } from "../login/LoginActions";
import { toast } from "react-toastify";


class CreateConsumer extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            name: "",
            contact: ""
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

        fetch(process.env.REACT_APP_API + 'consumer/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + usertoken

            },
            body: JSON.stringify({
                'name': event.target.name.value,
                'contact': event.target.contact.value
            })
        })
            .then(res => res.json())
            .then((result) => {
                if (result == true) this.props.history.push('/not-received');
                
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

                        <Button className="btn btn-success " style={{ "color": "white", fontSize: "15px" }} type="submit" >
                            Submit
                        </Button>


                    </Form>
                </div>
            </div>

        );


    }
}

CreateConsumer.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logout
})(withRouter(CreateConsumer));