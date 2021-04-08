import React from "react"
import {Link} from "react-router-dom";

class NavBar extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">LAVenture</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            { this.props.userLoggedIn &&
                                <li className="nav-item newActivity">
                                    <Link className="nav-link"
                                        to={{
                                            pathname: "/newactivity"
                                            // state: "" // pass user information to new activity page so DB knows who to
                                                        // create new activity for
                                        }}
                                    >
                                        Create New Activity
                                    </Link>
                                </li>
                            }
                            { !this.props.userLoggedIn &&
                                <li className="nav-item login-nav">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            }
                            { this.props.userLoggedIn &&
                                <li className="nav-item logout-nav ms-auto">
                                    { /* temporary solution for ui purposes*/ }
                                    <a className="nav-link" onClick={() => this.props.setULI(false)} >Logout</a>
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
