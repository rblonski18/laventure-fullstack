import './accounts.css';

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Link, Redirect} from "react-router-dom";
import {sha256} from "js-sha256";
import GoogleLogin from 'react-google-login';

export default class Login extends React.Component {
    state = {
        username: "",
        password: "",
        error: "none",
        errorColor: "",
        errorBorder: "",
        redirect: "",
    };

    setUsername = (e) => {
        this.setState({username: e.target.value});
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
        this.setState({username: '', password: '',
                            errorColor: '#ffb6c1', errorBorder: '1px solid red', error: 'block'});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const hashedPassword = sha256(this.state.password);
        fetch('/LAVenture/LoginServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: {username: this.state.username, password: hashedPassword}
        })
            .then(response => response.json())
            .then(response => {
                // if successful, should have received succcess=true, session ID, username
                this.setState({redirect: '/mainpage'});
                // otherwise, call throwError
            })
            .catch(err => {
                this.throwError();
            });
    }

    responseGoogle = (response) => {
        console.log(response.tokenId);
    }

    render() {
        if (this.state.redirect.length > 0) {
            return (
                <Redirect to={this.state.redirect}/>
            );
        } else {
            return (
                <div className={"outer-div"}>
                    <div className="Login">
                        <h1>Login <span style={{fontSize: 'x-large'}}>to LAVenture</span></h1>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group size="lg" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="text"
                                    value={this.state.username} required={true}
                                    onChange={(e) => this.setUsername(e)}
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
                        </Form>
                        <div className={"btn-group"}>
                            <Link className="nav-link login-link" to={"/newaccount"}>
                                Create new account
                            </Link>
                            <Link className="nav-link login-link" to={"/mainpage"}>
                                Continue as guest
                            </Link>
                        </div>
                        <div className="separator">OR</div>
                        <GoogleLogin
                            render={(renderProps) => (
                                <button id={"google-btn"} onClick={renderProps.onClick}>
                                    <i className={"fa fa-google"}/> Continue with Google
                                </button>
                            )}
                            clientId="333741736612-67il7uuvsssus89p7a1v7215go5ecvla.apps.googleusercontent.com"
                            onSuccess={(response) => this.responseGoogle(response)}
                            // onFailure={console.log('Unable to sign in with Google.')}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
            );
        }
    }
}
