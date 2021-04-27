import React, { useEffect, useState } from "react"
import data from "./demo.json"
import "../styles/activitypage.css"
import NavBar from "./NavBar";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import getCookie from "./Cookie";

const ActivityPage = ({ match }) => {

    const {
        params: { activityID },
    } = match;

    const [ activityName, setActivityName ] = useState('');
    const [ activityLocation, setActivityLocation ] = useState('');
    const [ activityAuthor, setActivityAuthor ] = useState('');
    const [ activityRating, setActivityRating ] = useState(0);
    const [ activityCategories, setActivityCategory ] = useState([]);
    const [ beach, setBeach ] = useState(false);
    const [ books, setBooks ] = useState(false);
    const [ entertainment, setEntertainment ] = useState(false);
    const [ exercise, setExercise ] = useState(false);
    const [ games, setGames ] = useState(false);
    const [ music, setMusic ] = useState(false);
    const [ nightLife, setNightLife ] = useState(false);
    const [ outdoors, setOutdoors ] = useState(false);
    const [ relax, setRelax ] = useState(false);
    const [ shopping, setShopping ] = useState(false);
    const [ sports, setSports ] = useState(false);
    const [ adventure, setAdventure ] = useState(false);
    const [ activityIMG, setActivityIMG ] = useState('');
    const [ activityReviews, setActivityReviews ] = useState([]);
    const [ rsvpBool, setRSVPBool ] = useState(false);
    const [ curr, setCurrent ] = useState(0);
    const [ cap, setCapacity ] = useState(0);
    const [ perc, setPercentage] = useState(0);
    const [ reviewText, setReviewText ] = useState('');
    const [ reviewRating, setReviewRating ] = useState(0);
    const [ userLoggedIn, setULI ] = useState(getCookie().length > 0);
    const [ rsvpButton, setRSVPButton] = useState(true);
    const [ username, setUsername] = useState('');

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

        // request for activity with the id of activityid
        fetch(`https://api.laventure.click/ActivityServlet?isRSVP=false&activityid=${activityID}`)
            .then(res => res.json())
            .then((activity) => {
                setActivityName(activity.title);
                setActivityLocation(activity.town);
                setActivityAuthor(activity.username);
                setActivityRating(activity.rating);
                setBeach(activity.beach);
                setBooks(activity.books);
                setMusic(activity.music);
                setEntertainment(activity.entertainment);
                setExercise(activity.exercise);
                setGames(activity.games);
                setNightLife(activity.nightLife);
                setOutdoors(activity.outdoors);
                setRelax(activity.relax);
                setShopping(activity.shopping);
                setSports(activity.sports);
                setAdventure(activity.adventure);
                setActivityIMG(activity.image);
                setRSVPBool(activity.maxRSVPs > 0);
                if(activity.maxRSVPs > 0) {
                    setCurrent(activity.RSVPCount);
                    setCapacity(activity.maxRSVPs);
                    setPercentage((activity.RSVPCount/activity.maxRSVPs)*100);
                }

            })

        // request for all reviews associated with the activity with id of activityid
        fetch(`https://api.laventure.click/ReviewsServlet?isRSVP=false&activityid=${activityID}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setActivityReviews(data)
            })
        
        let user = getCookie();
        if(user.length > 0) {
            // check if user is RSVPed to this activity.
            fetch(`https://api.laventure.click/RSVPServlet?activityid=${activityID}&username=${user}&task=checkStatus`)
                .then(res => res.json())
                .then((data) => {
                    if(data == "User is not RSVPed and not in queue.") setRSVPBool(true);
                    else setRSVPButton(false);
                })
            setULI(true);
        }


        setUsername(user);

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        await fetch('https://api.laventure.click/ReviewsServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                activityid: activityID,
                username: username,
                reviewtext: reviewText,
                rating: reviewRating
            })
        })

        fetch(`https://api.laventure.click/ReviewsServlet?isRSVP=false&activityid=${activityID}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                setActivityReviews(data)
            })
    }

    const handleRSVP = (event) => {

        setCurrent(curr+1);
        setPercentage(((curr+1)/cap)*100);
        setRSVPButton(false);
        fetch(`https://api.laventure.click/RSVPServlet`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                activityid: activityID,
                task: "add"
            })
        })
    }

    const handleCancelRSVP = (e) => {
        setCurrent(curr-1);
        setPercentage(((curr-1)/cap)*100);
        setRSVPButton(true);
        fetch(`https://api.laventure.click/RSVPServlet`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user: username,
                activityid: activityID,
                task: "cancel"
            })
        })
    }

    return (
        <div>
        <NavBar 
            userLoggedIn={userLoggedIn} 
            setULI={setULI}
        />
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
                            { beach && <span key={activityName+"beach"} className="category-badges badge badge-pill badge-info">Beach</span> }
                            { books && <span key={activityName +"books"} className="category-badges badge badge-pill badge-info">Books</span> }
                            { entertainment && <span key={activityName+"entertainment"} className="category-badges badge badge-pill badge-info">Entertainment</span> }
                            { exercise && <span key={activityName+"exercise"} className="category-badges badge badge-pill badge-info">Exercise</span> }
                            { games && <span key={activityName+"games"} className="category-badges badge badge-pill badge-info">Games</span> }
                            { music && <span key={activityName+"music"} className="category-badges badge badge-pill badge-info">Music</span> }
                            { nightLife && <span key={activityName+"nightLife"} className="category-badges badge badge-pill badge-info">Night Life</span> }
                            { outdoors && <span key={activityName+"outdoors"} className="category-badges badge badge-pill badge-info">Outdoors</span> }
                            { relax && <span key={activityName+"relax"} className="category-badges badge badge-pill badge-info">Relax</span> }
                            { shopping && <span key={activityName+"shopping"} className="category-badges badge badge-pill badge-info">Shopping</span> }
                            { sports && <span key={activityName+"sports"} className="category-badges badge badge-pill badge-info">Sports</span> }
                            { adventure && <span key={activityName+"adventure"} className="category-badges badge badge-pill badge-info">Adventure</span> }
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
                        { userLoggedIn && !rsvpButton &&
                            <button className="btn btn-danger RSVP-btn" onClick={(e) => handleCancelRSVP(e)}>Cancel</button>
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
                            <br />
                            <Form.Group>
                                <div className="rating-stars-ap">
                                <Form.Label>Leave a rating: </Form.Label>
                                    <div className="rating">
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
                                    </div>
                                </Form.Group>
                                
                                <Form.Group size="sm" controlId="btn">
                                    <button className="btn btn-info review-button" type="submit">Submit</button>
                                </Form.Group>
                        </Form>
                    </div>
                </div>
                }
                {  activityReviews.map((review) => {
                    return <div className="card review-card">
                        <div className="card-body">
                            <p className="card-text">{ review.reviewText }</p>
                            <p><b>{ review.username }</b></p>
                            <p>{ buildRatingStars(review.ratingVal) }</p>
                        </div>
                    </div>
                }) }
            </div>
        </div>
        </div>
    );
}

export default ActivityPage;
