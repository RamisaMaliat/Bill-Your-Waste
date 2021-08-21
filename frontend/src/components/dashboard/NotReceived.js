import React, { useState, useEffect, Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Footer from "../../subComponents/Footer";
import { logout } from "../login/LoginActions";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Header4 from '../../subComponents/Header4';


const Posts = ({ posts, loading }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <dl className="dictionary">
            {posts.map(post => (
                <div className="term" style={{ "fontSize": "16px" }}>
                    <dt>
                        <span><a id={post.ID} href={"../details/" + post.ID}><h3 style={{ "color": "black" }}>{post.title}</h3></a></span>
                    </dt>
                    <dd> <b>{"Title" + " " + ":" + " " + " "}</b>{post.title}</dd>
                    <dd> <b>{"Category" + " " + ":" + " " + " "}</b>{post.category}</dd>
                    <dd><b>{"Description" + " " + ":" + " " + " "}</b>{post.description}</dd>
                    <dd><b>{"Amount of waste (in grams)" + " " + ":" + " " + " "}</b>{post.amount}</dd>
                    <dd><b>{"Total cost (in taka)" + " " + ":" + " " + " "}</b>{post.price}</dd>
                    <dd><b>{"Will send to" + " " + ":" + " " + " "}</b>{post.full_address}</dd>
                    <button type="button" style={{"marginTop":"30px"}} className="btn btn-success" name="name" value={post.ID}><a style={{"color":"white"}}>Update Delivery Address</a></button>
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
    const [postsPerPage] = useState(4);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let usertoken = localStorage.getItem("token");
            const res = await axios.get(process.env.REACT_APP_API + 'consumer/notReceived',
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

class NotReceived extends Component {
    constructor(props) {
        super(props);
        this.state = {
            res1: "",
            res2: ""
        };
    }

    onLogout = () => {
        this.props.logout();
    };

    fetchData1() {
        let usertoken = localStorage.getItem("token");
        fetch(process.env.REACT_APP_API + 'merchant/totalDue',
            {
                headers: {
                    'Authorization': 'Bearer ' + usertoken
                }
            }
        )
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    res1: data
                });

            });
    }

    fetchData2() {
        let usertoken = localStorage.getItem("token");
        fetch(process.env.REACT_APP_API + 'merchant/totalReceived',
            {
                headers: {
                    'Authorization': 'Bearer ' + usertoken
                }
            }
        )
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    res2: data
                });

            });
    }


    componentDidMount() {
        this.fetchData1();
        this.fetchData2();
    }



    render() {
        const { user } = this.props.auth;
        var { res1 } = this.state;
        var { res2 } = this.state;

        if (res1 == null) res1 = 0;
        if (res2 == null) res2 = 0;

        return (
            <app>
                <Header4 />
                <div class="container" style={{ "height": "100px" }} >

                    <ul class="nav nav-tabs">
                        <li role="presentation" style={{ "paddingRight": "40px" }}><a href="received" style={{ "color": "green" }}>Received by you</a></li>
                        <li role="presentation" class="active" style={{ "paddingRight": "40px" }}><a style={{ "color": "green" }}>Not yet received</a></li>
                    </ul>
                </div>
                <div class="center-block log-in border" style={{ "maxWidth": "1000px", "padding": "10px" }}>
                    <ViewDashboard />
                </div>
                <Footer />
            </app>
        );

    }
}

NotReceived.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logout
})(withRouter(NotReceived));