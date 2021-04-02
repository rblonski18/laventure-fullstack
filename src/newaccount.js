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

    handleSubmit = () => {

    }

    render() {
        return (
            <div>
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

                    {/*<Button variant="btn btn-success" className="redirect-btn"*/}
                    {/*        onClick={() => history.push('/newacc')}>*/}
                    {/*    Create new account*/}
                    {/*</Button>*/}
                    {/*<Button variant="btn btn-success" className="redirect-btn"*/}
                    {/*        onClick={() => history.push('/home')}>*/}
                    {/*    Continue as guest*/}
                    {/*</Button>*/}
                </Form>
            </div>
        );
    }
}
