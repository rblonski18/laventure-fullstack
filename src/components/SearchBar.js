import React from "react"
import "../searchBar.css"

class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            keyword: '',
            filter: 'Title',
            temp: 0,
            weatherString: '',
            weatherIcon: '',
        }
    }
    
    componentDidMount = () => {
        fetch(`https://api.weatherbit.io/v2.0/current?key=4247ec7591994b7794e906958b50b6ad&city=Los%20Angeles`)
            .then(res => res.json())
            .then((json) => {
                this.setState({
                    keyword: '',
                    filter: this.state.filter,
                    temp: json.data[0].temp * 9 / 5 + 32,
                    weatherString: json.data[0].weather.description,
                    weatherIcon: json.data[0].weather.icon
                })
            })

        
    };

    setKeyword = (event, val) => {
        this.setState({keyword: val})
    } 

    updateBoth = (event, val) => {
        this.setState({filter: val});
        this.props.setMainPageFilter(val);
    }

    BarStyling = {background:"white", border:"none", padding:"0.5rem"};

    render() {
        return (
            <div id="cover">
                <form>
                    <div className="cover-left">
                        <div id="dropdown-div" className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Search By: {this.state.filter}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a key="title" className="dropdown-item" onClick={(e) => this.updateBoth(e, "Title")}>Title</a></li>
                                <li><a key="location" className="dropdown-item" onClick={(e) => this.updateBoth(e, "Location")}>Location</a></li>
                            </ul>
                        </div>
                        <div className="td search-bar-btn"><input type="text" placeholder="Search" required  onChange={(e) => this.setKeyword(e, e.target.value)}/></div>
                        <button className="search-bar-btn" onClick={(e) => {this.props.handleSearch(this.state.keyword); e.preventDefault()}}>
                            &#x1F50D;
                        </button>
                        {this.props.wf &&
                            <button className="search-bar-btn" id="reset" onClick={this.props.resetListing}>Reset</button>
                        }
                    </div>
                    <div className="weatherbit-api-styling">
                        <img src={`https://www.weatherbit.io/static/img/icons/${this.state.weatherIcon}.png`} />
                        <span>{this.state.weatherString} {parseInt(this.state.temp)} &#8457;</span>
                     </div>
                </form>
            </div>
        );
    }
}

export default SearchBar
