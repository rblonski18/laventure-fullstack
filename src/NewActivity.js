import './accounts.css';
import './NewActivity.css';
import NavBar from "./components/NavBar";

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Multiselect} from 'multiselect-react-dropdown';
import {FaRegImages} from 'react-icons/fa';
import ImageUploader from "react-images-upload";
import {GoogleAddressLookup, DatePicker, TimePicker} from 'react-rainbow-components';

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
        location: "",
        categories: [],
        images: [],
        date: null, // format is MM/dd/yyyy
        time: null, // note: stored in military time with no AM/PM in the format HH:mm (ie. 15:00)
        capacity: 0
    };

    componentDidMount() {
        // dynamically set values in categories array (fetch data from DB)
    }

    validateForm() {
        if (this.state.date != null) {
            return true;
        }

        // if (this.state.title.length > 0 && this.state.description.length > 0 && this.state.location.length > 0 &&
        //     this.state.categories.length > 0 && this.state.images.length > 0) {
        //     if (this.state.date == null && this.state.time == null && this.state.capacity === 0) {
        //         return true;
        //     }
        //
        //     if (this.state.date != null || this.state.time != null || this.state.capacity !== 0) {
        //         return this.state.date != null && this.state.time != null && this.state.capacity !== 0;
        //     }
        // }
        // return false;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // verify: address radius, date/time not in past, capacity > 0
        if (this.state.date != null) {
            let stateDate = new Date(this.state.date);
            let now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            if (stateDate < now) {
                // TODO error handling
                return;
            } else if (stateDate.getFullYear() === now.getFullYear() && stateDate.getMonth() === now.getMonth() &&
                       stateDate.getDate() === now.getDate()) {
                // date is today, time must be later than current time
                const stateTime = this.state.time.toString().split(':');
                stateDate.setHours(stateDate.getHours() + parseInt(stateTime[0]));
                stateDate.setMinutes(stateDate.getMinutes() + parseInt(stateTime[1]));

                now = new Date(); // current date and time
                if (stateDate.getHours() < now.getHours()) {
                    // TODO error handling
                    return;
                } else if (stateDate.getHours() === now.getHours()) {
                    if (stateDate.getMinutes() <= now.getMinutes()) {
                        // TODO error handling
                        return;
                    }
                }
                console.log('good date/time');
            }

            if (this.state.capacity <= 0) {
                // TODO error handling
                return;
            }
        }
        // enter data into database
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

    onDrop = (pictureFiles, pictureDataURLs) => {
        this.setState({images: this.state.images.concat(pictureFiles)});
    }

    setImages = (e) => {
        const files = e.target.files;
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        let goodImages = this.state.images;
        for (let i = 0; i < files.length; i++) {
            if (validImageTypes.includes(files[i].type)) {

                // only add file if not already in list
                if (goodImages.indexOf(files[i]) < 0) {
                    goodImages.push(files[i]);
                }
            }
        }
        this.setState({images: goodImages});
        this.getSelectedFiles(goodImages);
    }

    getSelectedFiles(goodImages) {
        let list = "";
        for (let i = 0; i < goodImages.length; i++) {
            if (goodImages[i].name != null) {
                list += goodImages[i].name;
                if (i < goodImages.length - 1) {
                    list += ", ";
                }
            }
        }
        document.getElementById('list').innerHTML = "Files added: " + list;
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
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="validationCustom01">
                            <Form.Label>Activity</Form.Label>
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
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text"
                                value={this.state.description}
                                onChange={(e) => this.setState({description: e.target.value})}
                                required={true}
                            />
                        </Form.Group>
                        <div className="horizontal-alignment">
                            <Form.Group size="lg" controlId="location" className={"half"} style={{margin: '0 1% 0 0'}}>
                                <Form.Label>Address</Form.Label>
                                <GoogleAddressLookup
                                    className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                                    id="gaddresslookup-4"
                                    placeholder="Enter location"
                                    // onChange={value => setState({ value })}
                                    // value={this.state.location}
                                    // apiKey={LIBRARY_GOOGLE_MAPS_APIKEY}
                                    searchOptions={{
                                        location: {
                                            latitude: -33.941264,
                                            longitude: 151.2042969,
                                        },
                                        country: 'us',
                                        radius: 150000,
                                        types: ['address'],
                                    }}
                                    // required={true}
                                />
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
                            <Form.Label>Images</Form.Label>
                            {/*<label htmlFor={'file-upload'} className={'custom-file-upload'}>*/}
                            {/*    <FaRegImages/>Upload*/}
                            {/*</label>*/}
                            {/*<input id={'file-upload'} type={'file'} multiple={true} required={true}*/}
                            {/*       onChange={(e) => {this.setImages(e)}}*/}
                            {/*/>*/}
                            {/*<label id={"list"}/>*/}
                            <ImageUploader
                                fileContainerStyle={{
                                    width: '100%',
                                    border: '2px solid green',
                                    padding: '0',
                                    margin: '0'
                                }}
                                withIcon={false}
                                withPreview={true}
                                buttonText="Upload images"
                                buttonStyles={{backgroundColor: 'green'}}
                                onChange={this.onDrop}
                                label={"Max file size: 5 MB, accepted: .jpg, .gif, .png"}
                                required={true}
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
                        <Button block size="lg" className="block-button" type="submit" disabled={!this.validateForm()}>
                            Create Activity
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}
