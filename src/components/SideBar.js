import React from "react"
import ActivityListing from "./ActivityListing"
import "../MainPage.css"

class SideBar extends ActivityListing {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div>
            { this.props.activityListing.map((activity, key) => {
                const imgString = activity.img
                return <div className="activity" key={ activity.name }>
                    <div className="card">
                        <div className="card-body">
                        <div className="thumbnail" style={{backgroundImage: "url(" + imgString +")" }}> </div>
                            <h5 className="card-title">{activity.name}</h5>
                            <p className="card-text">{activity.location}</p>
                            <a href="#" className="btn btn-primary ratingBTN">Rating = {activity.rating}/5</a>
                        </div>
                    </div>
                </div>
            })}
            </div>
        );
    }


}

export default SideBar