import './accounts.css';
import './NewActivity.css';
import NavBar from "./components/NavBar";

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
import {Multiselect} from 'multiselect-react-dropdown';
import {FaRegImages} from 'react-icons/fa';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {DatePicker, TimePicker} from 'react-rainbow-components';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';

const categoriesList = [
    {value: 'adventure', label: 'Adventure'},
    {value: 'beach', label: 'Beach'},
    {value: 'books', label: 'Books'},
    {value: 'entertainment', label: 'Entertainment'},
    {value: 'exercise', label: 'Exercise'},
    {value: 'games', label: 'Games'},
    {value: 'music', label: 'Music'},
    {value: 'night-life', label: 'Night Life'},
    {value: 'outdoors', label: 'Outdoors'},
    {value: 'relax', label: 'Relax'},
    {value: 'shopping', label: 'Shopping'},
    {value: 'sports', label: 'Sports'}
];
const centerOfLA = [34.052235, -118.243683];

export default class NewActivity extends React.Component {
    state = {
        title: "",
        description: "",
        location: "",
        lat: "",
        lon: "",
        categories: [],
        image: null,
        rating: 0,
        date: null, // format is MM/dd/yyyy
        time: null, // note: stored in military time with no AM/PM in the format HH:mm (ie. 15:00)
        capacity: 0,
        attending: null
    };

    componentDidMount() {
        toast.configure();
    }

    validateForm() {
        if (this.state.title.length > 0 && this.state.description.length > 0 && this.state.location.length > 0 &&
            this.state.categories.length > 0 && this.state.image != null && this.state.rating > 0) {
            if (this.state.date == null && this.state.time == null && this.state.capacity === 0) {
                return true;
            }

            if (this.state.date != null || this.state.time != null || this.state.capacity !== 0 ||
                this.state.capacity != null) {
                return (this.state.date != null && this.state.time != null && this.state.capacity !== 0 &&
                       this.state.capacity != null);
            }
        }
        return false;
    }

    toasterError() {
        toast.info(this.state.title + ' could not be created.', {type: 'error', pauseOnHover: false});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // verify address radius with haversine formula found at https://www.movable-type.co.uk/scripts/latlong.html
        const R = 6371e3; // meters
        const phi1 = centerOfLA[0] * Math.PI/180; // phi, lambda in radians
        const phi2 = this.state.lat * Math.PI/180;
        const deltaPhi = (this.state.lat - centerOfLA[0]) * Math.PI/180;
        const deltaLambda = (this.state.lng - centerOfLA[1]) * Math.PI/180;

        const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const distance = R * c; // in meters
        if (distance > 50000) {
            toast.info('ERROR! Location selected is outside the Los Angeles area.',
                {type: 'error', autoClose: 10_000, pauseOnHover: false});
            return;
        }

        // verify date/time not in past, capacity > 0
        if (this.state.date != null) {
            let stateDate = new Date(this.state.date);
            let now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            if (stateDate < now) {
                toast.info('ERROR! Date has already occurred.',
                    {type: 'error', autoClose: 10_000, pauseOnHover: false});
                this.setState({date: null});
                return;
            } else if (stateDate.getFullYear() === now.getFullYear() && stateDate.getMonth() === now.getMonth() &&
                       stateDate.getDate() === now.getDate()) {
                // date is today, time must be later than current time
                const stateTime = this.state.time.toString().split(':');
                stateDate.setHours(stateDate.getHours() + parseInt(stateTime[0]));
                stateDate.setMinutes(stateDate.getMinutes() + parseInt(stateTime[1]));

                now = new Date(); // current date and time
                if (stateDate.getHours() < now.getHours()) {
                    toast.info('ERROR! Time has already occurred today.',
                        {type: 'error', autoClose: 10_000, pauseOnHover: false});
                    this.setState({time: null});
                    return;
                } else if (stateDate.getHours() === now.getHours()) {
                    if (stateDate.getMinutes() <= now.getMinutes()) {
                        toast.info('ERROR! Time has already occurred today.',
                            {type: 'error', autoClose: 10_000, pauseOnHover: false});
                        this.setState({time: null});
                        return;
                    }
                }
            }

            if (this.state.capacity <= 0) {
                toast.info('ERROR! Capacity is less than or equal to 0.',
                    {type: 'error', autoClose: 10_000, pauseOnHover: false});
                this.setState({capacity: 0});
                return;
            }
        }

        // enter data into database
        fetch('LAVenture/NewActivityServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: this.state.title,
                description: this.state.description,
                location: this.state.location,
                latitude: this.state.lat,
                longitude: this.state.lng,
                categories: this.state.categories,
                image: this.state.image,
                rating: this.state.rating,
                date: this.state.date,
                time: this.state.time,
                capacity: this.state.capacity,
                attending: this.state.attending
            })
        })
            .then(response => response.json())
            .then(response => {
                // if success= true,
                toast.info(this.state.title + ' successfully created.',
                    {type: 'success', pauseOnHover: false});
                // otherwise, toasterError
            })
            .catch(err => {
                this.toasterError();
            });
    }

    handleLocationSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const latlng = await getLatLng(results[0]);
        this.setState({lat: latlng.lat, lng: latlng.lng, location: value});
    }

    // new category selected
    onSelect = (selectedList, selectedItem) => {
        let list = this.state.categories;
        list.push(selectedItem.label);
        this.setState({categories: list});
    }

    // one of selected categories removed
    onRemove = (selectedList, selectedItem) => {
        let list = this.state.categories;
        const index = list.indexOf(selectedItem.label);
        list.splice(index, 1);
        this.setState({categories: list});
    }

    setImage = (e) => {
        const files = e.target.files;
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (validImageTypes.includes(files[0].type)) {
            this.setState({image: files[0]});
            document.getElementById('image-label').innerText = 'Replace ' + files[0].name;
        } else {
            toast.info('ERROR! Image must end in .gif, .jpg, or .png.',
                {type: 'error', pauseOnHover: false});
        }
    }

    setRating = (e) => {
        const id = e.target.id, num = id[0];
        if (id.includes('fill')) {
            // unstar
            this.setState({rating: 0});
            for (let i = 1; i <= 5; i++) {
                const element = document.getElementById(i + '-fill');
                if (element != null) {
                    element.id = i + '-not';
                    document.getElementById(i + '-not').style.color = 'black';
                }
            }
        } else {
            // star
            this.setState({rating: num});
            for (let i = 1; i <= num; i++) {
                const element = document.getElementById(i + '-not');
                if (element != null) {
                    element.id = i + '-fill';
                    document.getElementById(i + '-fill').style.color = 'gold';
                }
            }
            for (let i = num + 1; i <= 5; i++) {
                const element = document.getElementById(i + '-fill');
                if (element != null) {
                    element.id = i + '-not';
                    document.getElementById(i + '-not').style.color = 'black';
                }
            }
        }
    }

    addZeros(str) {
        str = str.toString();
        if (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }

    setDate = (e) => {
        this.setState({
            date: (this.addZeros(e.getMonth() + 1) + "/" + this.addZeros(e.getDate()) + "/" + e.getFullYear())
        });
    }

    toggleAttending = () => {
        if (this.state.attending == null) {
            this.setState({attending: 'true'});
        } else {
            this.setState({attending: !this.state.attending});
        }
    }

    render() {
        return (
            <div>
                <div>
                    <NavBar/>
                </div>
                <div className="NewActivity">
                    <h1 className="page-title">Create a New Activity</h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="validationCustom01">
                            <Form.Label>Activity Title</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={this.state.title}
                                onChange={(e) => {
                                    this.setState({title: e.target.value})
                                }}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="exampleFormControlTextarea1">
                            <Form.Label>Description (max 350 characters)</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text" maxLength={"350"} rows={"4"}
                                value={this.state.description}
                                onChange={(e) => this.setState({description: e.target.value})}
                                required={true}
                            />
                        </Form.Group>
                        <div className="horizontal-alignment">
                            <Form.Group size="lg" controlId="location" className={"half"} style={{margin: '0 1% 0 0'}}>
                                <Form.Label>Location</Form.Label>
                                <PlacesAutocomplete value={this.state.location}
                                                    onChange={(e) => this.setState({location: e})}
                                                    onSelect={(e) => this.handleLocationSelect(e)}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                        <div>
                                            <input {...getInputProps({placeholder: "Enter location"})} type="search"/>
                                            <div className={"location-finder"}>
                                                {loading ? <div>Loading</div> : null}
                                                {suggestions.map(suggestion => {
                                                    const style = {
                                                        backgroundColor: suggestion.active ? "#98d7c2" : "white"
                                                    };

                                                    return (
                                                        <div
                                                            {...getSuggestionItemProps(suggestion, {style})}
                                                            key={suggestion.placeId}
                                                        >
                                                            {suggestion.description}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                            </Form.Group>
                            <Form.Group className="half" style={{margin: '0 0 0 1%'}}>
                                <Form.Label>Categories</Form.Label>
                                <Multiselect
                                    id="multi-select" options={categoriesList} showArrow={true} onSelect={this.onSelect}
                                    avoidHighlightFirstOption={true} onRemove={this.onRemove} displayValue={'label'}
                                    required={true}
                                />
                            </Form.Group>
                        </div>
                        <div className="horizontal-alignment">
                            <Form.Group size="lg" controlId="images" className="half form-group-images" style={{margin: '0 1% 0 0'}}>
                                <Form.Label>Image Upload</Form.Label>
                                <label id={'image-label'} htmlFor={'file-upload'} className={'custom-file-upload'}>
                                    <FaRegImages/>Select an image
                                </label>
                                <input id={'file-upload'} type={'file'} required={true}
                                       onChange={(e) => {this.setImage(e)}}
                                />
                            </Form.Group>
                            <Form.Group size="lg" className="half" style={{margin: '0 0 0 1%'}}>
                                <Form.Label>Rate This Activity</Form.Label>
                                <div id={"star-div"}>
                                    <StarBorderIcon id={'1-not'} role={'button'} onClick={(e) => this.setRating(e)} fontSize={'large'}/>
                                    <StarBorderIcon id={'2-not'} role={'button'} onClick={(e) => this.setRating(e)} fontSize={'large'}/>
                                    <StarBorderIcon id={'3-not'} role={'button'} onClick={(e) => this.setRating(e)} fontSize={'large'}/>
                                    <StarBorderIcon id={'4-not'} role={'button'} onClick={(e) => this.setRating(e)} fontSize={'large'}/>
                                    <StarBorderIcon id={'5-not'} role={'button'} onClick={(e) => this.setRating(e)} fontSize={'large'}/>
                                </div>
                            </Form.Group>
                        </div>
                        <div className="outer-box">
                            <label>RSVP (optional)</label>
                            <div className="optional-fields">
                                <Form.Group size="lg" controlId="date"
                                            style={{padding: '1%'}}>
                                    <Form.Label>Date</Form.Label>
                                    <DatePicker
                                        className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                                        value={this.state.date}
                                        placeholder={null}
                                        onChange={(e) => this.setDate(e)}
                                    />
                                </Form.Group>
                                <Form.Group size="lg" controlId="time"
                                            style={{padding: '1%'}}>
                                    <Form.Label>Time</Form.Label>
                                    <TimePicker
                                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                                        value={this.state.time}
                                        placeholder={"12:00 AM"}
                                        onChange={(e) => this.setState({time: e})}
                                    />
                                </Form.Group>
                                <Form.Group size="lg" controlId="cap"
                                            style={{padding: '1%'}}>
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={this.state.capacity}
                                        onChange={(e) => this.setState({capacity: e.target.value})}
                                    />
                                </Form.Group>
                            </div>
                            <div className="optional-fields">
                                <Form.Group size="lg" controlId="attending" style={{padding: '0 1%'}}>
                                    <Form.Check
                                        type="checkbox" label="I will be attending this event."
                                        onChange={this.toggleAttending}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <br/>
                        <Button
                            block size="lg" className="btn btn-primary" id="create-activity-btn" type="submit"
                            disabled={!this.validateForm()}
                        >
                            Create Activity
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}
