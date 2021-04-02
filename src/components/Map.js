import React from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

class Map extends React.Component {

    position = [34.0224, -118.2851];

    cosntructor(props) {
        var position = [34.0224, -118.2851];
    }

    render() {
        return (
            <MapContainer center={this.position} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={this.position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                </Marker>
            </MapContainer>
        );
    }
}

export default Map