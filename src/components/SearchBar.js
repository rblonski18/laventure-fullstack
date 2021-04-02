import React from "react"

class SearchBar extends React.Component {

    constructor(props) {
        super(props)
    }

    BarStyling = {background:"#F2F1F9", border:"none", padding:"0.5rem"};

    render() {
        return (
            <div>
                <input
                    style={this.BarStyling}
                    key="searchbar"
                    value={this.props.keyword}
                    placeholder={"Search activities"}

                />
            </div>
        );
    }
}

export default SearchBar