import React from "react"

class NavBar extends React.Component {

    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">LAVenture</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item newActivity">
                    <a className="nav-link" href="#">Create New Activity</a>
                    </li>
                    <li className="nav-item login-nav">
                    <a className="nav-link" href="#">Login</a>
                    </li>
                    <li className="nav-item logout-nav ms-auto">
                    <a className="nav-link" href="#">Logout</a>
                    </li>
                </ul>
                </div>
            </div>
            </nav>
        );
    }
}

export default NavBar