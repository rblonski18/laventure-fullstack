import "./accounts.css";

import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class NewAccount extends React.Component {
    state = {
        fname: "",
        lname: "",
        email: "",
        password: "",
    };

    validateForm() {
        return this.state.fname.length > 0 && this.state.lname.length > 0 && this.state.email.length > 0 &&
               this.state.password.length > 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.fname + " " + this.state.lname + " " + this.state.email + " " + this.state.password);
    }

    setFname = (val) => {
        this.setState({fname: val});
    }

    setLname = (val) => {
        this.setState({lname: val});
    }

    setEmail = (val) => {
        this.setState({email: val});
    }

    setPassword = (val) => {
        this.setState({password: val});
    }

    render() {
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
                            onChange={(e) => this.setFname(e.target.value)}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group size="lg" controlId="lname">
                        <Form.Label>Last Name</Form.Label>
                        <br/>
                        <Form.Control
                            type="lname"
                            value={this.state.lname}
                            onChange={(e) => this.setLname(e.target.value)}
                        />
                    </Form.Group>
                    <br/>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <br/>
                        <Form.Control
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
                    <br/>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()} className="create-acc-btn">
                        Create Account
                    </Button>
                </Form>
            </div>
        );
    }
}
