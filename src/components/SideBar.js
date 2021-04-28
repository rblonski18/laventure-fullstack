import React from "react"
import "../MainPage.css"

class SideBar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: this.props.username,
            uli: this.props.userLoggedIn,
            sortBy: '',
            default: [this.props.activityListing],
            activities: [],
            byRating: [],
            recentlyViewed: []
        }
    }

    getCookie = () => {
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

    componentDidMount() {

        let username = this.getCookie();

        fetch(`https://api.laventure.click/ActivityListServlet?sortBy=none&user=${username}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState({activities: data})
            })

        // request for list of activities sorted by rating
        fetch(`https://api.laventure.click/ActivityListServlet?sortBy=rating&user=${username}`)
            .then(res => res.json())
            .then((data) => {
                this.setState({byRating: data})
            })

        // request for recently viewed activities of user w/ username specified
        fetch(`https://api.laventure.click/ActivityListServlet?sortBy=recent&user=${username}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState({recentlyViewed: data})
            })

    }

    handleSort = (event, val) => {
        if (val === "Rating") {
            this.setState({sortBy: 'Rating', activities: this.state.byRating});
            this.props.onChange('Rating', this.state.activities);
        } else if (val === "Recently Viewed") {

            // request for recently viewed activities of user w/ username specified
            const username = this.getCookie();
            fetch(`https://api.laventure.click/ActivityListServlet?sortBy=recent&user=${username}`)
                .then(res => res.json())
                .then((data) => {
                    // this.setState({recentlyViewed: data})
                    this.setState({sortBy: 'Recently Viewed', activities: data});
                    this.props.onChange('Recently Viewed', data);
                })
        } else if (val === "None") {
            this.setState({sortBy: '', activities: this.state.default});
            this.props.onChange('', this.state.default);
        }
    }

    render() {
        let list;
        if (this.state.sortBy === '' || document.getElementById('search-bar-input').value !== '') {
            list = this.props.activityListing;
        } else {
            list = this.state.activities;
        }

        return (
            <div>
                <div className="sort-by-card">
                    <div className="card">
                        <div id="dropdown-div" className="dropdown sidebar-dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort By: {this.state.sortBy}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a key="none" className="dropdown-item" onClick={(e) => this.handleSort(e, "None")}>None</a></li>
                                <li><a key="rating" className="dropdown-item" onClick={(e) => this.handleSort(e, "Rating")}>Rating</a></li>
                                { this.props.userLoggedIn &&
                                    <li><a key="recent-viewed" className="dropdown-item" onClick={(e) => this.handleSort(e, "Recently Viewed")}>Recently Viewed</a></li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>

            <div className="activities-sidebar">
            {   list.map((activity) => {
                const items = [];
                const rating = Math.floor(activity.rating);
                for(var i = 0; i < rating; i++) {
                    items.push(<span key={activity.title+i} className="fa fa-star checked"/>)
                }
                for(var j = 0; j < 5-rating; j++) {
                    items.push(<span key={activity.title+(5-j)} className="fa fa-star"/>)
                }
                const imgString = activity.image;
                return (
                    <div className="activity" key={ activity.title } >
                        <div className="card">
                            <div className="card-body">
                                <img className="thumbnail" src={imgString} alt={"Image not found."}/>
                                <div className="right">
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
                    </div>)
                })}
                </div>
            </div>
        );
    }


}

export default SideBar
