import React, { useState, useEffect, Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Footer from "../subComponents/Footer";
import { logout } from "../components/login/LoginActions";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Header6 from '../subComponents/Header6';
import { toast } from "react-toastify";
import Popup from 'reactjs-popup';

function confirmOrder(event){
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
            'id': event.target.name.value
        })
    })
        .then(res => res.json())
        .then((result) => {
            if (result == true) {
                this.props.history.push('/not-received');    
                toast.info("We will pick the wastes tomorrow between 10 am to 12 pm from your address. We will contact through your contact number or email address if necessary. You will receive your dues at the end of this month through the provided payment method for your account (if you want you can update it anytime). Contact us if you have any query. Thank you for being with us!", 
                { position: "top-center", autoClose:false });               
            }
            else toast.error("Error Occurred! Try again!", { position: "top-center"});
            
        },
            (error) => {
                toast.error("Error Occurred! Try again!", { position: "top-center" });
            })
}


const Posts = ({ posts, loading }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <dl className="dictionary">
            {posts.map(post => (
                <div className="term" style={{ "fontSize": "16px" }}>
                    <dt>
                        <span><a href={post.ID}><h3 style={{ "color": "black" }}>{post.title}</h3></a></span>
                    </dt>
                    <dd> <b>{"Title" + " " + ":" + " " + " "}</b>{post.title}</dd>
                    <dd> <b>{"Category" + " " + ":" + " " + " "}</b>{post.category}</dd>
                    <dd><b>{"Description" + " " + ":" + " " + " "}</b>{post.description}</dd>
                    <dd><b>{"Amount of waste (in grams)" + " " + ":" + " " + " "}</b>{post.amount}</dd>
                    <dd><b>{"Cost per gram (in taka)" + " " + ":" + " " + " "}</b>{post.price}</dd>
                    <button type="button" style={{"marginTop":"30px"}} className="btn btn-success" name="name" value={post.ID}><a style={{"color":"white"}} href={post.ID}>Place Order</a></button>

                </div>
            ))}
        </dl>
    );
};

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const ViewDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let usertoken = localStorage.getItem("token");
            const path = window.location.pathname;
            const query = 'consumer'+path
            const res = await axios.get(process.env.REACT_APP_API + query,
                {
                    headers: {
                        'Authorization': 'Bearer ' + usertoken
                    }
                }
            );
            setPosts(res.data);
            setLoading(false);
        };

        fetchPosts();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <app>
            <Posts posts={currentPosts} loading={loading} />
            <Pagination
                postsPerPage={postsPerPage}
                totalPosts={posts.length}
                paginate={paginate}
            />
        </app>
    );
};

class PlaceYourOrder extends Component {
    constructor(props) {
        super(props);
    }

    onLogout = () => {
        this.props.logout();
    };

    render() {
        const { user } = this.props.auth;
       

        return (
            <app>
                <Header6 />
                <div class="container" style={{ "height": "0px" }} >
                  <h2 style={{ "marginBottom": "0px", "textAlign":"center"}} ><b>Place Order</b></h2>
                </div>
                <div class="center-block log-in border" style={{"marginTop": "0px", "maxWidth": "1000px", "padding": "10px" }}>
                    <ViewDashboard />
                </div>
                <Footer />
            </app>
        );

    }
}

PlaceYourOrder.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logout
})(withRouter(PlaceYourOrder));