import React from "react"
import "../MainPage.css"

class SideBar extends React.Component {

    constructor(props) {
        super(props)
    }


    render() {

        return (
            <div>
            { this.props.activityListing.map((activity) => {
                const items = [];
                for(var i = 0; i < activity.rating; i++) {
                    items.push(<span className="fa fa-star checked"></span>)
                }
                for(var j = 0; j < 5-activity.rating; j++) {
                    items.push(<span className="fa fa-star"></span>)
                }
                const imgString = activity.img;
                return <div className="activity" key={ activity.name } >
                    <div className="card">
                        <div className="card-body">
                        <div className="thumbnail" style={{backgroundImage: "url(" + imgString +")" }}> </div>
                            <h5 className="card-title ct-limit"><a className="sidebar-titles" href={`/activity/${activity.id}`}>{activity.name}</a> 
                            { activity.RSVP && <span className="badge badge-pill badge-primary rsvp">RSVP</span> }
                            </h5>
                            <p className="rating-stars">{ items }</p>
                            <div className="categories"> 
                                { activity.categories.map((category) => {
                                    return <span className="badge badge-pill badge-info">{category}</span>
                                })}
                            </div>
                            <p className="card-text">{activity.location}</p>
                            
                        </div>
                    </div>
                </div>
            })}
            </div>
        );
    }


}

export default SideBar