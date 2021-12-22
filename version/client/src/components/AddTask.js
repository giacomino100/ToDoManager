import React from 'react';
import { useState, FloatingLabel } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button, Modal, Form} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import dayjs from 'dayjs';

import API from '../API';

import './AddTask.css';

function ModalAdd(props) {

    const {setUpdated} = props;

    const [newDescr, setNewDescr] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newPriv, setNewPriv] = useState(false);
    const [newImprt, setNewImprt] = useState(false);

    const users = [{id:1, name: "Giacomo"}]

    const submit = async (e) => {
        e.preventDefault();

        //let dateISO8601 = dayjs(newDate).toISOString()

        const obj = {description: newDescr, important: newImprt ? true : false, private: newPriv ? true : false, deadline: dayjs(newDate).toISOString(), completed: false}; 


        API.addTask(obj)
        .then( () => {
            setUpdated(true);
        })
        .catch((err) => {
            console.log('connetti alla rete locale!');
        })
        
        handleClose();
    };

    const handleClose = () => {
        setNewDescr('');
        setNewDate('');
        setNewPriv(false);
        setNewImprt(false);

        props.handleClose();
    };

    return (
        <Modal show={props.showAdd} onHide={handleClose} backdrop="static">

            <Modal.Header closeButton>
                <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>

            <Form onSubmit={submit}>
                <Modal.Body>
    
                    <Form.Group as={Row} controlId="formDescription">
                        <Form.Label column sm="2">Description</Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" onChange={(e) => setNewDescr(e.target.value)} value={newDescr} required/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formDate">
                        <Form.Label column sm="2">Date</Form.Label>
                        <Col sm="10">
                            <Form.Control type="datetime-local" onChange={(e) => setNewDate(e.target.value)} value={newDate} />
                        </Col>
                    </Form.Group>

                    <Row>
                        <Col sm="6">
                            <Form.Group controlId="formPrivate">
                                <Form.Check type="checkbox" label="Private" onChange={(e) => setNewPriv(e.target.checked ? true : false)} checked={newPriv} />
                            </Form.Group>
                        </Col>
                        <Col sm="6">
                            <Form.Group controlId="formImportant">
                                <Form.Check type="checkbox" label="Important" onChange={(e) => setNewImprt(e.target.checked ? true : false)} checked={newImprt} />
                            </Form.Group>
                        </Col>
                    </Row>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="dark" type="submit">
                        Save Changes
                    </Button>
                </Modal.Footer>

            </Form>

        </Modal>
    );
}

const AddTask = (props) => {

    const [showAdd, setShowAdd] = useState(false);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    return (
        <>
            <button className='add-task' onClick={handleShowAdd}>
                <FontAwesomeIcon icon={faPlus} className='add-task-plus' />
            </button>
            <ModalAdd showAdd={showAdd} handleClose={handleCloseAdd} handleShow={handleShowAdd} setUpdated={props.setUpdated} setTasks={props.setTasks} />
        </>
    );
}

export default AddTask;
