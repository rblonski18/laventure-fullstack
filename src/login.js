import './accounts.css';
import history from './history';

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {ButtonGroup} from "react-bootstrap";

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
                        <br/>
                        <Form.Control
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </Form.Group>
                    <br/>
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
                    <Button block size="lg" className="btn btn-primary" id="login-button" type="submit" disabled={!this.validateForm()}>
                        Login
                    </Button>
                    <ButtonGroup variant="container">
                        <Button className="redirect-btn" onClick={() => history.push('/newaccount')}>
                            Create new account
                        </Button>
                        <Button className="redirect-btn" onClick={() => history.push('/mainpage')}>
                            Continue as guest
                        </Button>
                    </ButtonGroup>
                </Form>
            </div>
        );
    }
}
