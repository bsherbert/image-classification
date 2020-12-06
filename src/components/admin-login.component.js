import React, {Component} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Redirect} from 'react-router';
import AdminReview from '../components/admin-review.component.js';
import Button from 'react-bootstrap/Button'

export default class AdminLogin extends Component{
    constructor(props){
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state={
            username: '',
            password: '',
            users: [],
            redirect: false,
        };

    }

    componentDidMount(){
        axios.get('http://206.189.192.230:5000/users/')
            .then(response =>{
                this.setState({users: response.data});
            })
            .catch((error) => {
                console.log(error);
            })

    }

    onChangeUsername(e){
        this.setState({
            username: e.target.value,
        });
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value,
        });
    }

    onSubmit(e){
        e.preventDefault();

        var found = false;

        for(let i=0; i<this.state.users.length; i++){
            if(this.state.users[i].username === this.state.username
                && this.state.users[i].password === this.state.password){
                    //proceed to page with flag
                    found = true;
                    this.setState({redirect: true});
                }
        }

        if(!found){
            //todo: show properly
            console.log("invalid password");
        }

    }

    render(){

        if(this.state.redirect){
            return(
                <Router>
                    <Route path="/adminReview"
                        render={()=> <AdminReview isAdmin={true} />}
                    />
                <Redirect push to="/adminReview" />
                </Router>
            );
        }

        return(
            <div>
                <h1>Login</h1>
                <form className="login" onSubmit={this.onSubmit}>
                    <label>Username:</label>
                    <input required
                    type="text"
                    id="userName"
                    value={this.state.username}
                    onChange={this.onChangeUsername} />
                    <br />
                    <label>Password:</label>
                    <input required
                    type="password"
                    id="password"
                    value={this.state.password}
                    onChange={this.onChangePassword} />
                    <br />
                    <Button variant="secondary" type="submit" value="Submit">Submit</Button>
                </form>
            </div>
        );

    }


}