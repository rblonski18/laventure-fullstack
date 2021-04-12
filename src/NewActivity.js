import './accounts.css';
import './NewActivity.css';
import NavBar from "./components/NavBar";

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Multiselect} from 'multiselect-react-dropdown';
import {FaRegImages} from 'react-icons/fa';
import {GoogleAddressLookup, DatePicker, TimePicker} from 'react-rainbow-components';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';

// can change value to a number if desired, the label is what is displayed, value is for internal use
let categoriesList = [
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

export default class NewActivity extends React.Component {
    state = {
        title: "",
        description: "",
        location: "temp",
        categories: [],
        image: null,
        date: null, // format is MM/dd/yyyy
        time: null, // note: stored in military time with no AM/PM in the format HH:mm (ie. 15:00)
        capacity: 0
    };

    componentDidMount() {
        // dynamically set values in categories array (fetch data from DB)

        toast.configure();

    }

    validateForm() {
        if (this.state.title.length > 0 && this.state.description.length > 0 && this.state.location.length > 0 &&
            this.state.categories.length > 0 && this.state.image.length != null) {
            if (this.state.date == null && this.state.time == null && this.state.capacity === 0) {
                return true;
            }

            if (this.state.date != null || this.state.time != null || this.state.capacity !== 0) {
                return this.state.date != null && this.state.time != null && this.state.capacity !== 0;
            }
        }
        return false;
    }

    toasterError() {
        toast.info(this.state.title + ' could not be created.', {type: 'error', pauseOnHover: false});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // verify: address radius, date/time not in past, capacity > 0
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
        fetch('LAVenture/NewAcitivityServlet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: this.state.title,
                description: this.state.description,
                location: this.state.location,
                categories: this.state.categories,
                image: this.state.image,
                date: this.state.date,
                time: this.state.time,
                capacity: this.state.capacity
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
        const validImageTypes = ['image/gif', 'image/jpg', 'image/png'];
        if (validImageTypes.includes(files[0].type)) {
            this.setState({image: files[0]});
            document.getElementById('image-label').innerText = 'Replace ' + files[0].name;
        } else {
            toast.info('ERROR! Image must end in .gif, .jpg, or .png.',
                {type: 'error', pauseOnHover: false});
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
                                {/*<GoogleAddressLookup*/}
                                {/*    className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"*/}
                                {/*    id="gaddresslookup-4"*/}
                                {/*    placeholder="Enter location"*/}
                                {/*    // onChange={value => setState({ value })}*/}
                                {/*    // value={this.state.location}*/}
                                {/*    // apiKey={LIBRARY_GOOGLE_MAPS_APIKEY}*/}
                                {/*    searchOptions={{*/}
                                {/*        location: {*/}
                                {/*            latitude: -33.941264,*/}
                                {/*            longitude: 151.2042969,*/}
                                {/*        },*/}
                                {/*        country: 'us',*/}
                                {/*        radius: 150000,*/}
                                {/*        types: ['address'],*/}
                                {/*    }}*/}
                                {/*    required={true}*/}
                                {/*/>*/}
                            </Form.Group>
                            <Form.Group className="half" style={{margin: '0 0 0 1%'}}>
                                <Form.Label>Categories</Form.Label>
                                <Multiselect
                                    id="multi-select" options={categoriesList} showArrow={true} onSelect={this.onSelect}
                                    onRemove={this.onRemove} displayValue={'label'} required={true}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group size="lg" controlId="images" className="form-group-images">
                            <Form.Label>Image Upload</Form.Label>
                            <label id={'image-label'} htmlFor={'file-upload'} className={'custom-file-upload'}>
                                <FaRegImages/>Select an image
                            </label>
                            <input id={'file-upload'} type={'file'} required={true}
                                   onChange={(e) => {this.setImage(e)}}
                            />
                        </Form.Group>
                        <div className="outer-box">
                            <label>RSVP (optional)</label>
                            <div className="optional-fields">
                                <Form.Group size="lg" controlId="date" className={"optional-options"}
                                            style={{padding: '1%'}}>
                                    <Form.Label>Date</Form.Label>
                                    <DatePicker
                                        className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                                        value={this.state.date}
                                        placeholder={null}
                                        onChange={(e) => this.setDate(e)}
                                    />
                                </Form.Group>
                                <Form.Group size="lg" controlId="time" className={"optional-options"}
                                            style={{padding: '1%'}}>
                                    <Form.Label>Time</Form.Label>
                                    <TimePicker
                                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                                        value={this.state.time}
                                        placeholder={"12:00 AM"}
                                        onChange={(e) => this.setState({time: e})}
                                    />
                                </Form.Group>
                                <Form.Group size="lg" controlId="cap" className={"optional-options"}
                                            style={{padding: '1%'}}>
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={this.state.capacity}
                                        onChange={(e) => this.setState({capacity: e.target.value})}
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
