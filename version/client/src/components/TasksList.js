import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Button, Card } from 'react-bootstrap';

import TaskElement from "./TaskElement.js";

import API from '../API';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

const TasksList = (props) => {

    const {tasks, setTasks, updated, loggedIn, user, setUpdated} = props
    const statusMsg = 'Loading...';

    const [page, setPage] = useState('');
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
        if(filter === 'allyourtasks')
            return filteredTasks
        if(filter === 'today')
            return filteredTasks.filter( t => t.deadline && t.deadline.isToday())
        if(filter === 'next7days')
            return filteredTasks.filter( t => isNextWeek(t.deadline))
        if(filter === 'important')
            return filteredTasks.filter( t => t.important)
    }
    

    useEffect(() => {
        if(updated){
            if(loggedIn === false){
                API.getPublicTasks()
                .then(res => {
                    setPage(res)
                    setTasks(res.tasks)
                    setUpdated(false)
                })
                .catch((err) => console.log(err))
            } else if(loggedIn === true){
                API.getUserTasks(false, user.id)
                .then(res => {
                    setPage(res)
                    let filteredTasks = handleFilteredTasks(res.tasks)
                    setTasks(filteredTasks)
                    setUpdated(false)
                })
                .catch((err) => console.log(err))
            }
        }

    }, [updated, user.id, loggedIn, setTasks, setUpdated]);


    return (
        <>
        <h3><b>Filter:</b> {display_filter}</h3>
        <p>Page: {page.currentPage}/{page.totalPages}</p>
        {updated ? <h5>{statusMsg}</h5> : <ListGroup id='list-tasks'>
            { tasks.map((tk) => <Card style={{margin: "5px"}}><TaskElement key={tk.id} task={tk} setTasks={props.setTasks} completed={tk.completed} loggedIn={loggedIn} setUpdated={setUpdated}/></Card> ) } 
        </ListGroup>}
        <br />
        {/* <Button >next</Button>
        <Button >back</Button> */}
        <br />
        <br />
        </>
    );
};

export default TasksList;