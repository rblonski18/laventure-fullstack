import React from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

class Map extends React.Component {

    constructor(props) {
        super(props)
    }

    position = [34.0224, -118.2851];

    render() {
        return (
            <MapContainer center={this.position} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { this.props.activityList.map((activity, key) => {
                    return (
                        <Marker key={activity.coordinates} position={activity.coordinates}>
                            <Popup>
                                {activity.name}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        );
    }
}

export default Map