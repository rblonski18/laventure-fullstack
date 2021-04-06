import './accounts.css';

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Link} from "react-router-dom";

export default class Login extends React.Component {
    state = {
        email: "",
        password: "",
    };

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.email + " " + this.state.password);
    }

    render() {
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
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <br/>
                        <Form.Control
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}
                        />
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
