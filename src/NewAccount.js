import "./accounts.css";

import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router";
import {sha256} from "js-sha256";

export default class NewAccount extends React.Component {
    state = {
        fname: "",
        lname: "",

        email: "",
        emailColor: "",
        emailBorder: "",
        emailError: "none",

        username: "",
        usernameColor: "",
        usernameBorder: "",
        usernameError: "none",

        password: "",
        passwordColor: "",
        passwordBorder: "",
        passwordError: "none",
        confirmPassword: "",

        redirect: "",
    };

    setEmail = (e) => {
        this.setState({email: e.target.value});
        if (e.target.value.length > 0 && this.state.emailColor.length > 0) {
            this.setState({emailColor: '', emailBorder: '', emailError: 'none'});
        }
    }

    setUsername = (e) => {
        this.setState({username: e.target.value});
        if (e.target.value.length > 0 && this.state.usernameColor.length > 0) {
            this.setState({usernameColor: '', usernameBorder: '', usernameError: 'none'});
        }
    }

    setPassword = (e) => {
        this.setState({password: e.target.value});
        if (e.target.value.length > 0 && this.state.passwordColor.length > 0) {
            this.setState({passwordColor: '', passwordBorder: '', passwordError: 'none'});
        }
    }

    setConfirmPassword = (e) => {
        this.setState({confirmPassword: e.target.value});
        if (e.target.value.length > 0 && this.state.passwordColor.length > 0) {
            this.setState({passwordColor: '', passwordBorder: '', passwordError: 'none'});
        }
    }

    errorMsg() {
        this.setState({fname: '', lname: '', email: '', emailColor: '#ffb6c1',
            emailBorder: '1px solid red', emailError: 'block', username: '', usernameColor: '#ffb6c1',
            usernameBorder: '1px solid red', usernameError: 'block', password: '', confirmPassword: ''});
    }

    setCookie(user) {
        this.setState({redirect: '/mainpage'});
        const d = new Date();
        d.setTime(d.getTime() + (24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        document.cookie = "user=" + user + ";" + expires + ";path=/";
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({password: '', confirmPassword: '',
                passwordColor: '#ffb6c1', passwordBorder: '1px solid red', passwordError: 'block'});
            return;
        }

        const hashedPassword = sha256(this.state.password);
        fetch('LAVenture/NewAccountServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: {
                name: this.state.fname + ' ' + this.state.lname,
                email: this.state.email,
                username: this.state.username,
                password: hashedPassword,
                type: 'normal'
            }
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 200) {
                    this.setCookie(this.state.username);
                } else {
                    this.errorMsg();
                }
            })
            .catch(() => {
                this.errorMsg();
            });
    }

    render() {
        if (this.state.redirect.length > 0) {
            return (
                <Redirect to={this.state.redirect}/>
            );
        } else {
            return (
                <div className={"outer-div"}>
                    <div className="NewAccount">
                        <h1>Welcome to LAVenture!</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <div className="horizontal-alignment">
                                <Form.Group className="form-group-half" size="lg" controlId="fname">
                                    <Form.Label>First Name</Form.Label>
                                    <br/>
                                    <Form.Control
                                        autoFocus
                                        type="fname"
                                        value={this.state.fname} required={true}
                                        onChange={(e) => {this.setState({fname: e.target.value})}}
                                    />
                                </Form.Group>
                                <Form.Group className="form-group-half" size="lg" controlId="lname">
                                    <Form.Label>Last Name</Form.Label>
                                    <br/>
                                    <Form.Control
                                        type="lname"
                                        value={this.state.lname} required={true}
                                        onChange={(e) => this.setState({lname: e.target.value})}
                                    />
                                </Form.Group>
                            </div>
                            <Form.Group size="lg" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <br/>
                                <Form.Control
                                    type="email"
                                    value={this.state.email} required={true}
                                    onChange={(e) => this.setEmail(e)}
                                    style={{backgroundColor: this.state.emailColor, border: this.state.emailBorder}}
                                />
                                <Form.Text className={"red-text"} style={{display: this.state.emailError}}>
                                    An account with the email or username entered already exists.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group size="lg" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <br/>
                                <Form.Control
                                    type="text"
                                    value={this.state.username} required={true}
                                    onChange={(e) => this.setUsername(e)}
                                    style={{backgroundColor: this.state.usernameColor, border: this.state.usernameBorder}}
                                />
                                <Form.Text className={"red-text"} style={{display: this.state.usernameError}}>
                                    An account with the email or username entered already exists.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group size="lg" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <br/>
                                <Form.Control
                                    type="password"
                                    value={this.state.password} required={true}
                                    onChange={(e) => this.setPassword(e)}
                                    style={{backgroundColor: this.state.passwordColor, border: this.state.passwordBorder}}
                                />
                                <Form.Text className={"red-text"} style={{display: this.state.passwordError}}>
                                    The passwords entered do not match.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group size="lg" controlId="confirm-password">
                                <Form.Label>Confirm Password</Form.Label>
                                <br/>
                                <Form.Control
                                    type="password"
                                    value={this.state.confirmPassword} required={true}
                                    onChange={(e) => this.setConfirmPassword(e)}
                                    style={{backgroundColor: this.state.passwordColor, border: this.state.passwordBorder}}
                                />
                                <Form.Text className={"red-text"} style={{display: this.state.passwordError}}>
                                    The passwords entered do not match.
                                </Form.Text>
                            </Form.Group>
                            <br/>
                            <div className={"form-group"}>
                                <Button block size="lg" type="submit" id="create-acc-btn">
                                    Create Account
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            );
        }
    }
}
