import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Button, Card, Row, Col, Container } from 'react-bootstrap';

import TaskElement from "./TaskElement.js";

import API from '../API';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

export default function TasksList(props){
    const {updated, loggedIn, user, setUpdated} = props
    const statusMsg = 'Loading...';

    const [tasks, setTasks] = useState([]);

    const [page, setPage] = useState('');
    const [pageNo, setPageNo] = useState(false)


    const loc = useLocation();

    let filter = (loc.pathname ? loc.pathname.substring(1, loc.pathname.length) : '');
    let display_filter = filter.slice();
    display_filter = display_filter === 'next7days' ? 'Next 7 days' : (display_filter[0].toUpperCase() + display_filter.substr(1, display_filter.length));

    const isNextWeek = (d) => {
        const tomorrow = dayjs().add(1, 'day');
        const nextWeek = dayjs().add(7, 'day');
        const ret = d && (!d.isBefore(tomorrow, 'day') && !d.isAfter(nextWeek, 'day'));
        return ret;
    }


    const handleFilteredTasks = (filteredTasks) => {
        if(filter === 'all')
            return filteredTasks
        if(filter === 'today')
            return filteredTasks.filter( t => t.deadline && t.deadline.isToday())
        if(filter === 'next7days')
            return filteredTasks.filter( t => isNextWeek(t.deadline))
        if(filter === 'important')
            return filteredTasks.filter( t => t.important)
    }
    
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
            if(loggedIn === false){
                API.getPublicTasks(pageNo)
                .then(res => {
                    setPage(res)
                    setTasks(res.tasks)
                })
                .catch((err) => console.log(err))
            } else if(loggedIn === true){
                API.getUserTasks(pageNo, user.id)
                .then(res => {
                    setPage(res)
                    let filteredTasks = handleFilteredTasks(res.tasks)
                    setTasks(filteredTasks)
                })
                .catch((err) => console.log(err))
            }
            setUpdated(false)
        }

    }, [updated, user.id, loggedIn, setTasks, setUpdated, pageNo]);


    return (
        <>
        <h3><b>Filter:</b> {display_filter}</h3>
        <p>Page: {page.currentPage}/{page.totalPages}</p>
        {updated ? 
        <h5>{statusMsg}</h5> 
        : 
        <ListGroup id='list-tasks'>
            { tasks.map(tk => <Card style={{margin: "5px"}}><TaskElement key={tk.id} task={tk} setTasks={props.setTasks} completed={tk.completed} loggedIn={loggedIn} setUpdated={setUpdated}/></Card> ) } 
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


}