import React, { useEffect } from 'react';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Row, Col, Button, Modal, Form } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faChild } from '@fortawesome/free-solid-svg-icons';

import dayjs from 'dayjs';

import API from '../API';

import './TaskElement.css';
import Assignments from './Assignments';

function ModalDelete(props) {

    const {task, handleClose, setUpdated} = props;

    const deleteT = async (e) => {
        e.preventDefault();
        
        
        API.deleteTask(task.id)
        .then(() => {
            setUpdated(true)
            handleClose()
        })
        .catch((err) => console.log(err));
    }
    
    return (
        <Modal show={props.showDelete} onHide={props.handleClose}>

            <Modal.Header closeButton>
                <Modal.Title>Delete Task</Modal.Title>
            </Modal.Header>

            <Form onSubmit={deleteT}>
                <Modal.Body>
                <Form.Label >Are you sure to delete this task?</Form.Label>
                </Modal.Body>
                

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        No
                    </Button>
                    <Button variant="dark" type="submit">
                        Yes
                    </Button>
                </Modal.Footer>
            </Form>

        </Modal>
    );
}


function ModalEdit(props) {

    const {task, setUpdated, handleClose} = props;

    const [newDescr, setNewDescr] = useState(task.description ? task.description : '' );
    const [newDeadline, setNewDeadline] = useState(task.deadline.slice(0, 16)); //di tutta la stringa della deadline prendo solo le prime 16
    const [newPriv, setNewPriv] = useState(task.private);
    const [newImprt, setNewImprt] = useState(task.important);

    const submit = async (e) => {
        e.preventDefault();

        const obj = {id: task.id, description: newDescr, important: newImprt ? true : false, private: newPriv ? true : false, deadline: dayjs(newDeadline).toISOString(), completed: false}; 

        API.updateTask(obj)
        .then((res) => setUpdated(true))
        .catch(err => console.log(err))
        handleClose();

    }

    return (
        <Modal show={props.showEdit} onHide={props.handleClose} backdrop="static">

            <Modal.Header closeButton>
                <Modal.Title>Edit Task</Modal.Title>
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
                            <Form.Control type="datetime-local" onChange={(e) => setNewDeadline(e.target.value)} value={newDeadline} />
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
                    <Button variant="secondary" onClick={props.handleClose}>
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

function UserTaskElement(props) {

    const {task, loggedIn} = props;

    /** I have the needeed to have the set state to fill the value of checked */ 
    const [completed, setCompleted] = useState(task.completed)
    const [showMore, setShowMore] = useState(false) 

    let deadlineToDisplay = task.deadline
    deadlineToDisplay =  dayjs(deadlineToDisplay).isValid() ? dayjs(deadlineToDisplay).format('DD/MM/YYYY h:mm A') : '';
    
    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);


    const markTask = async (taskId) => {
        API.completeTask(taskId)
        .then(() => setCompleted(completed ? false : true))
        .catch((err) => console.log(err))
    };


    return (
        <ListGroup.Item id='elem-task'>
            <Row>
                <Col md={5}>
                    <label>{task.description}</label>
                </Col>

                <Col>
                    {!task.private && <FontAwesomeIcon icon={faChild} />}
                </Col>

                <Col md={3}>
                    <small>{deadlineToDisplay}</small>
                </Col>
                <Col>
                    <Button onClick={handleShowEdit}><FontAwesomeIcon icon={faEdit} className='icon-btn'  /></Button>
                </Col>
                <Col>
                    <Button style={{fontSize: '11pt'}} onClick={() => setShowMore(showMore ? false : true)}>Show more </Button>
                </Col>
                <Col>
                    <Button onClick={handleShowDelete}><FontAwesomeIcon icon={faTrashAlt} className='icon-btn'  /></Button>
                </Col>
            </Row>
            {showMore && <>
            <hr></hr>
            <h5>Assignments</h5>
            <Row style={{margin: "2px"}}>
                <Assignments taskId={task.id}></Assignments>
            </Row></>}

            <ModalEdit setUpdated={props.setUpdated} showEdit={showEdit} handleClose={handleCloseEdit} handleShow={handleShowEdit} setTasks={props.setTasks} task={task} />
            <ModalDelete setUpdated={props.setUpdated} showDelete={showDelete} handleClose={handleCloseDelete} handleShow={handleShowDelete} setTasks={props.setTasks} task={task} />
        </ListGroup.Item>
    );
};

export default UserTaskElement;