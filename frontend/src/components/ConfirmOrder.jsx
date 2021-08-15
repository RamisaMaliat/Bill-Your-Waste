import React, { Component } from 'react';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";
import { logout } from "./login/LoginActions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class ConfirmOrder extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            details: ""
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

        fetch(process.env.REACT_APP_API + 'consumer/confirmOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + usertoken

            },
            body: JSON.stringify({
                'details': event.target.details.value,
                'path': window.location.pathname
            })
        })
            .then(res => res.json())
            .then((result) => {
                if (result == true) {
                    this.props.history.push('/not-received');
                    toast.info("Thank you for placing the order! If you have any query feel free to contact us. We will reach you though your contact number/email regarding the delivery of your order.",
                        { position: "top-center", autoClose: false });
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
                <p className="mt-4">
                    Go back to <Link to="/logged-in-home" class="green-text">Home</Link>
                </p>
                <div class="mt-4 mb-4 mx-auto rounded pt-4 " style={{ backgroundColor: "#ecffe6" }} >
                    <div class="text-center col log-in-div" style={{ backgroundColor: "#ecffe6" }} >
                        <img
                            src="CleanBD-logo.png" alt="CleanBD-logo"
                            id="log-in-img" style={{ height: "150px" }} />
                        <h3 class="green-text"><b>Confirm Your Order</b></h3>
                        <hr />
                    </div>

                    <Form class="log-in-form" onSubmit={this.handleSubmit}>
                        <Form.Group controlId="Id">
                            <Form.Label>Enter your address </Form.Label>
                            <Form.Control
                                as="textarea"
                                name="details"
                                rows={5}
                                placeholder="Where to delivery"
                                value={this.state.details}
                                onChange={this.onChange}
                                required
                            />
                        </Form.Group>

                        <Button className="btn btn-success " style={{ "color": "white", fontSize: "15px" }} type="submit" >
                            Submit
                        </Button>
                        <Button className="btn btn-success " style={{ "color": "white", fontSize: "15px", "marginLeft": "10px" }}  >
                            <a style={{ "color": "white" }} href="place-order">Cancel</a>
                        </Button>


                    </Form>
                </div>
            </div>

        );


    }
}

ConfirmOrder.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logout
})(withRouter(ConfirmOrder));