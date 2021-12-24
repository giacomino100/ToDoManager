import React, { useEffect } from 'react';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Row, Col, Button, Modal, Form } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faChild } from '@fortawesome/free-solid-svg-icons';

import dayjs from 'dayjs';

import API from '../API';

import './TaskElement.css';


function TaskElement(props) {

    const {task, loggedIn} = props;

    /** I have the needeed to have the set state to fill the value of checked */ 
    const [completed, setCompleted] = useState(task.completed)

    let deadlineToDisplay = task.deadline
    deadlineToDisplay =  dayjs(deadlineToDisplay).isValid() ? dayjs(deadlineToDisplay).format('DD/MM/YYYY h:mm A') : '';


    const markTask = async (taskId) => {
        API.completeTask(taskId)
        .then(() => setCompleted(completed ? false : true))
        .catch((err) => console.log(err))
    };


    return (
        <ListGroup.Item id='elem-task'>
            <Row>
                <Col md={5}>
                    {loggedIn  ? <>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id={task.id} checked={completed} onChange={() => markTask(task.id)} ></input> 
                        <label className={task.important ? 'custom-control-label important-task' : 'custom-control-label'} htmlFor={task.id}>{task.description}</label>
                    </div>
                    </>
                    :
                    <>
                    <label htmlFor={task.id}>{task.description}</label>
                    </>
                    }
                </Col>
                <Col>
                    {!task.private && <FontAwesomeIcon icon={faChild} />}
                </Col>

                <Col md={3}>
                    <small>{deadlineToDisplay}</small>
                </Col>
            </Row>
        </ListGroup.Item>
    );
};

export default TaskElement;