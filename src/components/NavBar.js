import React from "react"
import {Link} from "react-router-dom";

class NavBar extends React.Component {

    constructor(props) {
        super(props);
    }

    deleteCookie = () => {
        document.cookie = "user=" + this.props.username + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }

    handleLogout = () => {
        this.deleteCookie();
        this.props.setULI(false);
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
                            { this.props.userLoggedIn &&
                                <li className="nav-item newActivity">
                                    <Link className="nav-link"
                                          to={{pathname: "/newactivity"}}
                                    >
                                        Create New Activity
                                    </Link>
                                </li>
                            }
                            { !this.props.userLoggedIn &&
                                <li className="nav-item login-nav">
                                    <Link className="nav-link" to="/">Login</Link>
                                </li>
                            }
                            { this.props.userLoggedIn &&
                                <li className="nav-item logout-nav ms-auto">
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
