import React from "react"
import {Link} from "react-router-dom";
import {MainPage} from "./MainPage";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            userLoggedIn: this.props.userLoggedIn
        }
    }

    deleteCookie = () => {
        document.cookie = "user=" + this.props.username + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }

    handleLogout = () => {
        this.deleteCookie();
        this.setState({userLoggedIn: false})
    }

    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/mainpage">LAVenture</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            { this.state.userLoggedIn &&
                                <li className="nav-item newActivity">
                                    <Link className="nav-link"
                                          to={{pathname: "/newactivity"}}
                                    >
                                        Create New Activity
                                    </Link>
                                </li>
                            }
                            { !this.state.userLoggedIn &&
                                <li className="nav-item login-nav">
                                    <Link className="nav-link" to="/">Login</Link>
                                </li>
                            }
                            { this.state.userLoggedIn &&
                                <li className="nav-item logout-nav ms-auto" style={{cursor: 'pointer'}}>
                                    <a className="nav-link" onClick={this.handleLogout} >Logout</a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar
