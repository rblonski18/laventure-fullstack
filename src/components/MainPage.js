import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar"
import SideBar from "./SideBar"
import SearchBar from "./SearchBar"
import data from "./demo.json"
import Map from "./Map"

const MainPage = (props) => {

    const [keyword, setKeyword] = useState('');
    const [activityList, setActivityList] = useState([]);
    const [noneList, setNoneList] = useState([]);
    const [wasFiltered, setWF] = useState(false);
    const [filterBy,setFilter] = useState('Title');
    const [ userLoggedIn, setULI ] = useState(false);
    const [ username, setUsername ] = useState('');

    const handleSearch = (input) => {
        const filteredList = noneList.filter(activity => {
            if (filterBy === "Title") {
                return activity.title.toString().toLowerCase().includes(input.toString().toLowerCase());
            } else {
                return activity.town.toString().toLowerCase().includes(input.toString().toLowerCase());
            }
        });

        setWF(true);
        setActivityList(filteredList);
    }

    const getCookie = () => {
        var name = "user=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    useEffect(() => {
        fetch(`https://api.laventure.click/ActivityListServlet?sortBy=none&user=${username}`)
            .then(res => res.json())
            .then((data) => {
                setNoneList(data);
                setActivityList(data);
            })

        let user = getCookie();
        if(user.length > 0) {
            setUsername(user);
            setULI(true);
        }
    }, [])

    const resetListing = (event) => {
        setActivityList(noneList);
        setWF(false)
    }

    return(
        // render navbar
        <div className="content">
            <div>
                <NavBar
                    username={username}
                    userLoggedIn={userLoggedIn}
                    setUserLoggedIn={setULI}
                />
            </div>
            <div className="under">
                <div className="sidebar">
                    <SideBar
                        username={username}
                        activityListing={activityList}
                    />
                </div>
                <div className="mp-right">
                    <div className="searchBar-div">
                        <SearchBar
                            keyword={keyword}
                            setKeyword={setKeyword}
                            setMainPageFilter={setFilter}
                            handleSearch={handleSearch}
                            resetListing={resetListing}
                            wf={wasFiltered}
                        />
                    </div>
                    <div className="map-div">
                        <Map activityList={activityList} />
                    </div>
                </div>
            </div>
        </div>

    );

}

export default MainPage
