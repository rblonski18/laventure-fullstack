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
        if(val == "Rating") {
            this.setState({activities: this.state.byRating});
        } else if(val == "Recently Viewed") {
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
                    items.push(<span key={activity.name+i} className="fa fa-star checked"/>)
                }
                for(var j = 0; j < 5-activity.rating; j++) {
                    items.push(<span key={activity.name+(5-j)} className="fa fa-star"/>)
                }
                const imgString = activity.img;
                return <div className="activity" key={ activity.name } >
                    <div className="card">
                        <div className="card-body">
                        <div className="thumbnail" style={{backgroundImage: "url(" + imgString +")" }}> </div>
                            <h5 className="card-title ct-limit"><a className="sidebar-titles" href={`/activity/${activity.id}`}>{activity.name}</a>
                            { activity.RSVP && <span key={activity.name} className="badge badge-pill badge-primary rsvp">RSVP</span> }
                            </h5>
                            <p className="rating-stars">{ items }</p>
                            <div className="categories">
                                { activity.categories.map((category) => {
                                    return <span key={activity.name+category} className="badge badge-pill badge-info">{category}</span>
                                })}
                            </div>
                            <p className="card-text">{activity.location}</p>

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
