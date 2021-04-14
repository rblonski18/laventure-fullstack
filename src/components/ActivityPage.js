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
    const [ activityReviews, setActivityReviews ] = useState([]);
    const [ rsvpBool, setRSVPBool ] = useState(false);
    const [ curr, setCurrent ] = useState(0);
    const [ cap, setCapacity ] = useState(0);
    const [ perc, setPercentage] = useState(0);

    const buildRatingStars = (rating) => {
        const items = [];
        for(var i = 0; i < rating; i++) {
            items.push(<span key={i} className="fa fa-star checked"></span>)
        }
        for(var j = 0; j < 5-rating; j++) {
            items.push(<span key={j+i} className="fa fa-star"></span>)
        }
        return items;
    };

    useEffect(() => {

        data.forEach((activity) => {
            if(activity.id == activityID) {
                setActivityName(activity.name);
                setActivityLocation(activity.location);
                setActivityAuthor(activity.author);
                setActivityRating(activity.rating);
                setActivityCategory(activity.categories);
                setActivityIMG(activity.img);
                setActivityReviews(activity.reviews);
                setRSVPBool(activity.RSVP);
                if(rsvpBool) {
                    setCurrent(activity.currentRSVPed);
                    setCapacity(activity.RSVPcapacity);
                    setPercentage((activity.currentRSVPed/activity.RSVPcapacity)*100);
                }
            }
        })

    }, []);

    


    return (
        <div className="container mt-4 activity-page">

            <div className="col-6 activity-card">
                <div className="carousel">
                    <img src={ activityIMG } className="carousel-img w-100" alt="" />
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{ activityName }</h5>
                        <p className="card-text">{ activityLocation }</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li key={"categories"} className="list-group-item text-muted">
                            { activityCategories.map((category) => {
                                return <span key={category} className="badge badge-pill badge-info category-badges">{category}</span>
                            })}
                        </li>
                        <li key={"author"} className="list-group-item">Submitted by: { activityAuthor }</li>
                        <li key={"rating"} className="list-group-item">{ buildRatingStars(activityRating) }</li>
                    </ul>
                </div>
                { rsvpBool && 
                    <div>
                        <p>Number of people RSVPed: { curr } out of { cap } </p>
                        <div className="progress">
                            <div className="progress-bar bg-info" style={{width:  perc + '%'}}></div>
                        </div>
                    </div>
                }

            </div>
            <div className="col-6 reviews">
                { activityReviews.map((review) => {
                    return <div className="card review-card">
                        <div className="card-body">
                            <p className="card-text">{ review.text }</p>
                            <p>{ review.author }</p> 
                            <p>{ buildRatingStars(review.rating) }</p> 
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
}

export default ActivityPage;