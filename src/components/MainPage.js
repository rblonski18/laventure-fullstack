import React from 'react';
import NavBar from "./NavBar"
import SideBar from "./SideBar"
import SearchBar from "./SearchBar"
import Map from "./Map"

class MainPage extends React.Component {

    render() {
        return(
            // render navbar 
            <div className="content">
                <div>
                    <NavBar />
                </div>
                <div className="under">
                    <div className="col-4">
                        <SideBar />
                    </div>
                    <div className="mp-right col-8">
                        <div className="searchBar-div">
                            <SearchBar keyword="rand" />
                        </div>
                        <div className="map-div">
                            <Map />
                        </div>
                    </div>
                </div>
            </div>
            // render search bar above map
            // render map
        );

    }

}

export default MainPage