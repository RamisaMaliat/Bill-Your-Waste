import React, { useState, useEffect, Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Footer from "../subComponents/Footer";
import Header3 from "../subComponents/Header3";
import { logout } from "./login/LoginActions";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";


const Posts = ({ posts, loading }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <dl className="dictionary">
            {posts.map(post => (
                <div className="term" style={{"fontSize":"16px"}}>
                    <dd> <b>{"Name" + " " + ":" + " " + " "}</b>{post.name}</dd>
                    <dd> <b>{"Username" + " " + ":" + " " + " "}</b>{post.username}</dd>
                    <dd><b>{"Email" + " " + ":" + " " + " "}</b>{post.email}</dd>
                    <dd><b>{"Payment method" + " " + ":" + " " + " "}</b>{post.paymentMethodDetails}</dd>                   
                    <button type="button" style={{"marginTop":"30px"}} className="btn btn-success">Update Information</button>
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

const ViewAccount = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let usertoken = localStorage.getItem("token");
            const res = await axios.get(process.env.REACT_APP_API + 'merchant/account',
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
        </app>
    );
};

class MerchantAccount extends Component {

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
                <Header3 />
                <div class="container" style={{ "height": "30px" }} ><h2>Your Information</h2></div>
                <div class="center-block log-in border" style={{ "maxWidth": "1000px", "padding": "10px" }}>
                    <ViewAccount />
                </div>
                <Footer />
            </app>
        );

    }
}

MerchantAccount.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logout
})(withRouter(MerchantAccount));