import './accounts.css';

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Link, Redirect} from "react-router-dom";

export default class Login extends React.Component {
    state = {
        email: "",
        password: "",
        error: "none",
        errorColor: "",
        errorBorder: "",
        redirect: "",
    };

    setEmail = (e) => {
        this.setState({email: e.target.value});
        if (e.target.value.length > 0 && this.state.errorColor.length > 0) {
            this.setState({errorColor: '', errorBorder: '', error: 'none'});
        }
    }

    setPassword = (e) => {
        this.setState({password: e.target.value});
        if (e.target.value.length > 0 && this.state.errorColor.length > 0) {
            this.setState({errorColor: '', errorBorder: '', error: 'none'});
        }
    }

    throwError() {
        this.setState({email: '', password: '',
                            errorColor: '#ffb6c1', errorBorder: '1px solid red', error: 'block'});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        fetch('/LAVenture/LoginServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: this.state.email, password: this.state.password})
        })
            .then(response => response.json())
            .then(response => {
                // if successful, should have received succcess=true, session ID, email
                this.setState({redirect: '/mainpage'});
                // otherwise, call throwError
            })
            .catch(err => {
                this.throwError();
            });
    }

    render() {
        if (this.state.redirect.length > 0) {
            return (
                <Redirect to={"/mainpage"}
                    // to={{
                    //     pathname: "/mainpage",
                    //     state: {email: this.state.email, userLoggedIn: true}
                    // }}
                />
            );
        } else {
            return (
                <div className="Login">
                    <h1>Login <span style={{fontSize: 'large'}}>to LAVenture</span></h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                autoFocus
                                type="email"
                                value={this.state.email} required={true}
                                onChange={(e) => this.setEmail(e)}
                                style={{backgroundColor: this.state.errorColor, border: this.state.errorBorder}}
                            />
                            <Form.Text className={"red-text"} style={{display: this.state.error}}>
                                One or more fields are invalid.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <br/>
                            <Form.Control
                                type="password"
                                value={this.state.password} required={true}
                                onChange={(e) => this.setPassword(e)}
                                style={{backgroundColor: this.state.errorColor, border: this.state.errorBorder}}
                            />
                            <Form.Text className={"red-text"} style={{display: this.state.error}}>
                                One or more fields are invalid.
                            </Form.Text>
                        </Form.Group>
                        <br/>
                        <Form.Group size="lg" controlId="btn">
                            <Button block size="lg" className="btn btn-primary" id="login-button" type="submit">
                                Login
                            </Button>
                        </Form.Group>
                        <div className={"btn-group"}>
                            <Link className="nav-link login-link" to={"/newaccount"}>
                                Create new account
                            </Link>
                            <Link className="nav-link login-link" to={"/mainpage"}>
                                Continue as guest
                            </Link>
                        </div>
                    </Form>
                </div>
            );
        }
    }
}
