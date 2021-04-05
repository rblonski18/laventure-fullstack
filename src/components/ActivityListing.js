import React from 'react'
import data from "./demo.json"


class ActivityListing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activityList: data,
            filterBy: ''
        }
    }

    handleSearch = (event, input) => {
        console.log(this)
        const filteredList = this.state.activityList.filter(activity => {
            if(this.state.filterBy == "Title") {
                console.log(input.toString().toLowerCase())
                console.log(activity.name)
                console.log(activity.name.toString().toLowerCase().includes(input.toString().toLowerCase()))
                return activity.name.toString().toLowerCase().includes(input.toString().toLowerCase());
            } else {
                return activity.location.toString().toLowerCase().includes(input.toString().toLowerCase());
            }
        })

        this.setState({activityList: filteredList});
        console.log(this.state.activityList);
        console.log(filteredList)
        console.log(this.state.filterBy)
    }

    changeFilter = (event, val) => {
        this.setState({filterBy: val});
    }

    changeList = (event, list) => {
        this.setState({activityList: list});
    }

}

export default ActivityListing