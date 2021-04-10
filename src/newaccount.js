import "./accounts.css";

import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router";

export default class NewAccount extends React.Component {
    state = {
        fname: "",
        lname: "",
        email: "",
        emailColor: "",
        emailBorder: "",
        emailError: "none",
        password: "",
        redirect: "",
    };

    validateForm() {
        if (this.state.email.length > 0 && this.state.emailColor.length > 0) {
            this.setState({emailColor: '', emailBorder: '', emailError: 'none'});
        }
        return this.state.fname.length > 0 && this.state.lname.length > 0 && this.state.email.length > 0 &&
               this.state.password.length > 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // console.log(this.state.fname + " " + this.state.lname + " " + this.state.email + " " + this.state.password);

        // verify with back end that this email does not already exist in database

        const successful = false; // TODO change depending on if account was successfully created or not
        if (successful) {
            this.setState({redirect: '/mainpage'});
        } else {
            this.setState({fname: '', lname: '', email: '', emailColor: '#ffb6c1',
                emailBorder: '1px solid red', emailError: 'block', password: ''});
        }
    }

    render() {
        if (this.state.redirect.length > 0) {
            return (
                <Redirect to={this.state.redirect}/>
            );
        } else {
            return (
                <div className="NewAccount">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="fname">
                            <Form.Label>First Name</Form.Label>
                            <br/>
                            <Form.Control
                                autoFocus
                                type="fname"
                                value={this.state.fname}
                                onChange={(e) => this.setState({fname: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="lname">
                            <Form.Label>Last Name</Form.Label>
                            <br/>
                            <Form.Control
                                type="lname"
                                value={this.state.lname}
                                onChange={(e) => this.setState({lname: e.target.value})}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <br/>
                            <Form.Control
                                type="email"
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
                                style={{backgroundColor: this.state.emailColor, border: this.state.emailBorder}}
                            />
                            <Form.Text className={"red-text"} style={{display: this.state.emailError}}>
                                An account with the email entered already exists.
                            </Form.Text>
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
                        <Button block size="lg" type="submit" disabled={!this.validateForm()} id="create-acc-btn">
                            Create Account
                        </Button>
                    </Form>
                </div>
            );
        }
    }
}
