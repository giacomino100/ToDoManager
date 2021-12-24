import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Button, Card, Row, Col, Container } from 'react-bootstrap';

import UserTaskElement from "./UserTaskElement.js";

import API from '../API';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

const UserTasksList = (props) => {

    const { updated, loggedIn, user, setUpdated} = props
    const statusMsg = 'Loading...';
    const [tasks, setTasks] = useState([]);

    const [page, setPage] = useState('');
    const [pageNo, setPageNo] = useState(false)

    const loc = useLocation();
    
    const handleNext = () => {
        if(page.currentPage == page.totalPages){
            return;
        }
        setPageNo(parseInt(page.currentPage) + parseInt(1))
        setUpdated(true)
    }

    const handleBack = () => {
        if(page.currentPage == 1){
            return;
        }
        setPageNo(parseInt(page.currentPage) - parseInt(1))
        setUpdated(true)
    }

    useEffect(() => {
        if(updated){
            if(loggedIn === true){
                API.getUserTasks(pageNo, user.id)
                .then(res => {
                    setPage(res)
                    setTasks(res.tasks)
                    setUpdated(false)
                })
                .catch((err) => console.log(err))
            }
        }

    }, [updated, user.id, loggedIn, setTasks, setUpdated, pageNo]);


    return (
        <>
        <h3>Manage your tasks</h3>
        <p>Page: {page.currentPage}/{page.totalPages}</p>
        {updated ? <h5>{statusMsg}</h5> : <ListGroup id='list-tasks'>
            { tasks.map((tk) => <Card style={{margin: "5px"}}><UserTaskElement key={tk.id} task={tk} setTasks={props.setTasks} completed={tk.completed} loggedIn={loggedIn} setUpdated={setUpdated}/></Card> ) } 
        </ListGroup>}
        <br/>
        <Container className='d-flex justify-content-center'>
            <Row>
                <Col>
                    <Button onClick={() =>handleBack()}>Back</Button>&nbsp;
                    <Button onClick={() =>handleNext()}>Next</Button>
                </Col>
            </Row>
        </Container>

        <br />
        <br />
        </>
    );
};

export default UserTasksList;