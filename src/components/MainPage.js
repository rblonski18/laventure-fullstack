import React, { useState } from 'react';
import NavBar from "./NavBar"
import SideBar from "./SideBar"
import SearchBar from "./SearchBar"
import data from "./demo.json"
import Map from "./Map"

const MainPage = (props) => {

    
    const [keyword, setKeyword] = useState('');
    const [activityList, setActivityList] = useState(data);
    const [filterBy,setFilter] = useState('');
    const [wasFiltered, setWF] = useState(false);

    const handleSearch = (event, input) => {
        const filteredList = activityList.filter(activity => {
            if(filterBy == "Title") {
                return activity.name.toString().toLowerCase().includes(input.toString().toLowerCase());
            } else {
                return activity.location.toString().toLowerCase().includes(input.toString().toLowerCase());
            }
        })
    
        setWF(true)
        setActivityList(filteredList)
    }

    const resetListing = (event) => {
        setActivityList(data);
        setWF(false)
    }

    // write function to fetch data from db upon search keyword change

    return(
        // render navbar 
        <div className="content">
            <div>
                <NavBar />
            </div>
            <div className="under">
                <div className="sidebar">
                    <SideBar activityListing={activityList} />
                </div>
                <div className="mp-right">
                    <div className="searchBar-div">
                        <SearchBar 
                            keyword={keyword} 
                            setKeyword={setKeyword} 
                            setFilter={setFilter} 
                            handleSearch={handleSearch} 
                            resetListing={resetListing} 
                            wf={wasFiltered}
                        />
                    </div>
                    <div className="map-div">
                        <Map /*activityList={this.activityListing}*/ />
                    </div>
                </div>
            </div>
        </div>
        
    );

}

export default MainPage