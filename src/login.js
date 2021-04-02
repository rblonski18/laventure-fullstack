import './login.css';
import NewAccount from "./newaccount";
import history from './history';

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import {Router, Switch, Route, Link} from 'react-router-dom';

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

    setEmail = (val) => {
        this.setState({email: val});
    }

    setPassword = (val) => {
        this.setState({password: val});
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
                            onChange={(e) => this.setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <br/>
                        <Form.Control
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()} className="login-button">
                        Login
                    </Button>

                    <Button variant="btn btn-success" className="redirect-btn"
                            onClick={() => history.push('/NewAccount')}>
                        Create new account
                    </Button>
                    <Button variant="btn btn-success" className="redirect-btn"
                            onClick={() => history.push('/home')}>
                        Continue as guest
                    </Button>
                </Form>

                <Router history={history}>
                    {/*<Link to="./newaccount.js">click me</Link>*/}
                    {/*<Route exact path="./newaccount.js" component={NewAccount}></Route>*/}
                    <Switch>
                        <Route path={"/NewAccount"} exact component={NewAccount}/>
                    </Switch>
                    {/*<Switch>*/}
                    {/*    <Route path={"/home"} exact component={GuestPage}/>*/}
                    {/*</Switch>*/}
                </Router>
            </div>
        );
    }
}
