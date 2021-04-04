import './accounts.css';

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {FormControl} from "react-bootstrap";

// let categoriesList = [
//     { value: 'adventrue', label: 'Adventure' },
//     { value: 'beach', label: 'Beach' },
//     { value: 'night-life', label: 'Night Life' },
//     { value: 'relax', label: 'Relax' }
// ];

let categoriesList = [
    'Adventure', 'Beach', 'Night Life', 'Relax'
];

export default class NewActivity extends React.Component {
    state = {
        title: "",
        description: "",
        location: null,
        categories: [],
        images: [],
        date: null,
        time: null,
        capacity: 0
    };

    componentDidMount() {
        // dynamically set values in categories array (fetch data from DB)
    }

    validateForm() {
        if (this.state.title.length > 0 && this.state.description.length > 0 && this.state.location !== null &&
            this.state.categories.length > 0 && this.state.images.length > 0) {
            if (this.state.date !== null || this.state.time !== null || this.state.capacity !== 0) {
                return this.state.date !== null && this.state.time !== null && this.state.capacity !== 0;
            }
        } else {
            return false;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log()
    }

    setImages = (e) => {
        const files = e.target.files;
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        let goodImages = [];
        for (let i = 0; i < files.length; i++) {
            if (validImageTypes.includes(files[i].type)) {
                goodImages.push(files[i]);
            }
        }
        this.setState({ images: goodImages });
    }

    render() {
        return (
            <div className="NewActivity">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg" controlId="validationCustom01">
                        <Form.Label>Activity</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.title}
                            onChange={(e) => {this.setState({title: e.target.value})}}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="exampleFormControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="text"
                            value={this.state.description}
                            onChange={(e) => this.setState({description: e.target.value})}
                        />
                    </Form.Group>
                    <div className="horizontal-alignment">
                        <Form.Group size="lg" controlId="location">
                            <Form.Label>Address</Form.Label>
                        </Form.Group>
                        <Form.Group size="lg" controlId="categories">
                            <Form.Label>Categories</Form.Label>
                            {/*<Form.Control*/}
                            {/*    type="select"*/}
                            {/*    // multiple*/}
                            {/*    // options={categoriesList}*/}
                            {/*>*/}
                            {/*    <Select*/}
                            {/*        multiple*/}
                            {/*        value={null}*/}
                            {/*        placeholder={null}*/}
                            {/*    >*/}
                            {/*        {categoriesList.map((category) => (*/}
                            {/*            <MenuItem key={category} value={category}>*/}
                            {/*                {category}*/}
                            {/*            </MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*</Form.Control>*/}

                            {/*<Select*/}
                            {/*    multiple*/}
                            {/*    value={null}*/}
                            {/*    placeholder={null}*/}
                            {/*>*/}
                            {/*    {categoriesList.map((category) => (*/}
                            {/*        <MenuItem key={category} value={category}>*/}
                            {/*            {category}*/}
                            {/*        </MenuItem>*/}
                            {/*    ))}*/}
                            {/*</Select>*/}
                        </Form.Group>
                    </div>
                    <Form.Group size="lg" controlId="images">
                        <Form.Label>Images</Form.Label>
                        <br/>
                        <Form.Control
                            controlid="file-upload"
                            type="file"
                            multiple={true}
                            onChange={(e) => this.setImages(e)}
                        />
                    </Form.Group>
                    <div className="outer-box">
                        <label>RSVP (optional)</label>
                        <div className="optional-fields">
                            <Form.Group size="lg" controlId="date">
                                <Form.Label>Date</Form.Label>
                            </Form.Group>
                            <Form.Group size="lg" controlId="time">
                                <Form.Label>Time</Form.Label>
                            </Form.Group>
                            <Form.Group size="lg" controlId="cap">
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
        );
    }
}
