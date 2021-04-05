import React from "react"
import "../searchBar.css"

class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            keyword: '',
            filter: ''
        }
    }

    setKeyword = (event, val) => {
        this.setState({keyword: val})
    }

    updateBoth = (event, val) => {
        this.setState({filter: val})
        this.props.setFilter(val)
    }

    BarStyling = {background:"white", border:"none", padding:"0.5rem"};

    render() {
        return (
            <div id="cover">
                <form method="get" action="">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Search By: {this.state.filter}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a key="title" className="dropdown-item" onClick={(e) => this.updateBoth(e, "Title")}>Title</a></li>
                            <li><a key="location" className="dropdown-item" onClick={(e) => this.updateBoth(e, "Location")}>Location</a></li>
                        </ul>
                    </div>
                    <div className="td"><input type="text" placeholder="Search" required  onChange={(e) => this.setKeyword(e, e.target.value)}/></div>
                        <button type="submit" onClick={(e) => this.props.handleSearch(e, this.state.keyword)}>
                            &#x1F50D;
                        </button>
                    {this.props.wf &&
                        <button id="reset" onClick={this.props.resetListing}>Reset</button>
                    }   
                </form>
            </div>
        );
    }
}

export default SearchBar