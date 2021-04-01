import React from "react"
import data from "./demo.json"
import "../MainPage.css"

class SideBar extends React.Component {

    render() {

        return (
            <div>
            { data.activities.map((activity, key) => {
                return <div className="activity">
                    <div key={key} className="card">
                        <div className="card-body">
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