import React, { useEffect, useState } from "react"
import data from "./demo.json"
import "../styles/activitypage.css"

const ActivityPage = ({ match }) => {

    const {
        params: { activityID },
    } = match;

    const [ activityName, setActivityName ] = useState('');
    const [ activityLocation, setActivityLocation ] = useState('');
    const [ activityAuthor, setActivityAuthor ] = useState('');
    const [ activityRating, setActivityRating ] = useState(0);
    const [ activityCategories, setActivityCategory ] = useState([]);
    const [ activityIMG, setActivityIMG ] = useState('');

    useEffect(() => {

        data.forEach((activity) => {
            if(activity.id == activityID) {
                setActivityName(activity.name);
                setActivityLocation(activity.location);
                setActivityAuthor(activity.author);
                setActivityRating(activity.rating);
                setActivityCategory(activity.categories);
                setActivityIMG(activity.img);
            }
        })

    }, [])


    return (
        <div className="row container mt-4">
            <div className="col-6">
                <div className="carousel">
                    <img src={ activityIMG } className="carousel-img w-100" alt="" />
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{ activityName }</h5>
                        <p className="card-text">{ activityLocation }</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item text-muted">{ activityCategories } </li>
                        <li className="list-group-item">Submitted by: { activityAuthor }</li>
                        <li className="list-group-item">Rating: { activityRating }</li>
                    </ul>
                </div>

            </div>

            <div className="col-6">
                <div className="card">
                    <div className="card-body">
                        <p className="card-text">review will go here</p>
                        <p>Rating + Author</p> 
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityPage;