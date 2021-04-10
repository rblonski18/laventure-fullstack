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

    validateForm() {
        if (this.state.email.length > 0 || this.state.password.length > 0) {
            if (this.state.errorColor.length > 0) {
                this.setState({errorColor: '', errorBorder: '', error: 'none'});
            }
        }
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // console.log(this.state.email + " " + this.state.password);

        const successful = true; // TODO change depending on if account info is valid or not
        if (successful) {
            this.setState({redirect: '/mainpage'});
        } else {
            this.setState({email: '', password: '',
                errorColor: '#ffb6c1', errorBorder: '1px solid red', error: 'block'});
        }
    }

    render() {
        if (this.state.redirect.length > 0) {
            return (
                <Redirect to={'/mainpage'}/>
            );
        } else {
            return (
                <div className="Login">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
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
                                value={this.state.password}
                                onChange={(e) => this.setState({password: e.target.value})}
                                style={{backgroundColor: this.state.errorColor, border: this.state.errorBorder}}
                            />
                            <Form.Text className={"red-text"} style={{display: this.state.error}}>
                                One or more fields are invalid.
                            </Form.Text>
                        </Form.Group>
                        <br/>
                        <Form.Group size="lg" controlId="btn">
                            <Button block size="lg" className="btn btn-primary" id="login-button" type="submit" disabled={!this.validateForm()}>
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
