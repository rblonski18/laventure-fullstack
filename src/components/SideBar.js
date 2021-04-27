import React from "react"
import "../MainPage.css"

class SideBar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: this.props.username,
            uli: this.props.uli,
            sortBy: '',
            default: [this.props.activityListing],
            activities: [this.props.activityListing],
            byRating: [],
            recentlyViewed: []
        }
    }

    componentDidMount() {

        // request for list of activities sorted by rating
        fetch(`https://api.laventure.click/ActivityListServlet?sortBy=rating&user=${this.state.username}`)
            .then(res => res.json())
            .then((data) => {
                this.setState({byRating: data})
            })

        // request for recently viewed activities of user w/ username specified
        fetch(`https://api.laventure.click/ActivityListServlet?sortBy=recent&user=${this.state.username}`)
            .then(res => res.json())
            .then((data) => {
                this.setState({recentlyViewed: data})
            })

    }

    handleSort = (event, val) => {
        if(val === "Rating") {
            this.setState({activities: this.state.byRating});
        } else if(val === "Recently Viewed") {
            this.setState({activities: this.state.recentlyViewed});
        }
    }

    render() {

        return (
            <div>
                <div className="sort-by-card">
                    <div className="card">
                        <div id="dropdown-div" className="dropdown sidebar-dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort By: {this.state.sortBy}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a key="rating" className="dropdown-item" onClick={(e) => this.handleSort(e, "Rating")}>Rating</a></li>
                                { this.state.uli &&
                                    <li><a key="recent-viewed" className="dropdown-item" onClick={(e) => this.handleSort(e, "Recently Viewed")}>Recently Viewed</a></li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            <div className="activities-sidebar">
            { this.props.activityListing.map((activity) => {
                const items = [];
                for(var i = 0; i < activity.rating; i++) {
                    items.push(<span key={activity.title+i} className="fa fa-star checked"/>)
                }
                for(var j = 0; j < 5-activity.rating; j++) {
                    items.push(<span key={activity.title+(5-j)} className="fa fa-star"/>)
                }
                const imgString = activity.image;
                return <div className="activity" key={ activity.title } >
                    <div className="card">
                        <div className="card-body">

                        {/*<div className="thumbnail" style={{backgroundImage: "url('data:image/*;base64," + imgString +"')" }}><img src={"data:image/*;base64," + imgString} /> </div>*/}
                        {/*<img className="thumbnail" src={image}/>*/}
                        <img className="thumbnail" src={"data:image/*;base64," + imgString} alt={"Image not found."}/>
                            <h5 className="card-title ct-limit"><a className="sidebar-titles" href={`/activity/${activity.activityID}`}>{activity.title}</a>
                            { activity.maxRSVPs > 0 && <span key={activity.title} className="badge badge-pill badge-primary rsvp">RSVP</span> }
                            </h5>
                            <p className="rating-stars">{ items }</p>
                            <div className="categories">

                                { activity.beach && <span key={activity.title+"beach"} className="badge badge-pill badge-info">Beach</span> }
                                { activity.books && <span key={activity.title+"books"} className="badge badge-pill badge-info">Books</span> }
                                { activity.entertainment && <span key={activity.title+"entertainment"} className="badge badge-pill badge-info">Entertainment</span> }
                                { activity.exercise && <span key={activity.title+"exercise"} className="badge badge-pill badge-info">Exercise</span> }
                                { activity.games && <span key={activity.title+"games"} className="badge badge-pill badge-info">Games</span> }
                                { activity.music && <span key={activity.title+"music"} className="badge badge-pill badge-info">Music</span> }
                                { activity.nightLife && <span key={activity.title+"nightLife"} className="badge badge-pill badge-info">Night Life</span> }
                                { activity.outdoors && <span key={activity.title+"outdoors"} className="badge badge-pill badge-info">Outdoors</span> }
                                { activity.relax && <span key={activity.title+"relax"} className="badge badge-pill badge-info">Relax</span> }
                                { activity.shopping && <span key={activity.title+"shopping"} className="badge badge-pill badge-info">Shopping</span> }
                                { activity.sports && <span key={activity.title+"sports"} className="badge badge-pill badge-info">Sports</span> }
                                { activity.adventure && <span key={activity.title+"adventure"} className="badge badge-pill badge-info">Adventure</span> }
                            </div>
                            <p className="card-text">{activity.town}</p>

                        </div>
                    </div>
                </div>
            })}
            </div>
            </div>
        );
    }


}

export default SideBar

// const image =
//     "data:image/*;base64,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";
