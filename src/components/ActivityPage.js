import React, { useEffect, useState } from "react"
import data from "./demo.json"
import "../styles/activitypage.css"
import NavBar from "./NavBar";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    const [ reviewText, setReviewText ] = useState('');
    const [ reviewRating, setReviewRating ] = useState(0);
    const [ userLoggedIn, setULI ] = useState(true);
    const [ rsvpButton, setRSVPButton] = useState(true);

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

        /*
        // request for activity with the id of activityid
        fetch('LAVenture/ActivityServlet?isRSVP=false&activityid=${activityID}')

        // request for all reviews associated with the activity with id of activityid
        fetch(`LAVenture/ReviewsServlet?isRSVP=false&activityid=${activityID}`) */

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
                if(activity.RSVP) {
                    setCurrent(activity.currentRSVPed);
                    setCapacity(activity.RSVPcapacity);
                    setPercentage((activity.currentRSVPed/activity.RSVPcapacity)*100);
                }
            }
        })

    }, []);

    const handleSubmit = (e) => {

        e.preventDefault();

        /* fetch('LAVenture/ReviewsServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user: username,
                text: reviewText,
                rating: reviewRating
            }) 
        })*/
    }

    const handleLogout = () => {
        
        // request to handle logout
        /*
        fetch('LAVenture/LogoutServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user: username
            })
        })*/
        setULI(false);
    }

    const handleRSVP = (event) => {
        setCurrent(curr+1);
        setPercentage((curr/cap)*100);
        setRSVPButton(false);
        /* fetch('LAVenture/ActivityServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                isRSVP: true,
                user: username,
                activityid: activityID
            })
        }) */
    }
    
    return (
        <div>
        <NavBar userLoggedIn={userLoggedIn} />
        <div className="container mt-4 activity-page">

            <div className="col-6 activity-card">
                <div className="carousel">
                    <img src={ activityIMG } className="carousel-img w-100" alt="" />
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title"><b>{ activityName }</b></h5>
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
                        { userLoggedIn && rsvpButton &&
                            <button className="btn btn-info RSVP-btn" onClick={(e) => handleRSVP(e)}>RSVP</button> 
                        }
                    </div>
                }

            </div>
            <div className="col-6 reviews">
                { userLoggedIn &&
                <div className="review-form card">
                    <div className="card-body">
                        <Form onSubmit={handleSubmit} >
                            <Form.Group>
                                <Form.Label>Been here before? Leave a review! </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    type="text" maxLength={"140"} rows={"2"}
                                    value={reviewText}
                                    placeholder={"Enter text here"}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required={true}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Leave a rating: </Form.Label>
                                    <div class="rating">
                                        <label onClick={(e) => setReviewRating(1)}>
                                            <input type="radio" name="stars" value="1" />
                                            <span class="icon">★</span>
                                        </label>
                                        <label onClick={(e) => setReviewRating(2)}>
                                            <input type="radio" name="stars" value="2" />
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                        </label>
                                        <label onClick={(e) => setReviewRating(3)}>
                                            <input type="radio" name="stars" value="3" />
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>   
                                        </label>
                                        <label onClick={(e) => setReviewRating(4)}>
                                            <input type="radio" name="stars" value="4" />
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                        </label>
                                        <label onClick={(e) => setReviewRating(5)}>
                                            <input type="radio" name="stars" value="5" />
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                            <span class="icon">★</span>
                                        </label>
                                        </div>
                                </Form.Group>
                        </Form>
                    </div>
                </div>
                }
                { activityReviews.map((review) => {
                    return <div className="card review-card">
                        <div className="card-body">
                            <p className="card-text">{ review.text }</p>
                            <p><b>{ review.author }</b></p> 
                            <p>{ buildRatingStars(review.rating) }</p> 
                        </div>
                    </div>
                })}
            </div>
        </div>
        </div>
    );
}

export default ActivityPage;