import React, { useState } from "react"

const Activity = (props) => {

    const [activityName, setActivityName ] = useState('');
    const [activityLocation, setActivityLocation] = useState('');
    const [activityRating, setActivityRating] = useState(5);

    setActivityName(props.name);
    setActivityLocation(props.location);
    setActivityRating(props.rating);

    return (
        <div>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{activityName}</h5>
                    <p class="card-text">{activityLocation}</p>
                    <a href="#" class="btn btn-primary">{activityRating}</a>
                </div>
            </div>
        </div>
    );

}

export default Activity