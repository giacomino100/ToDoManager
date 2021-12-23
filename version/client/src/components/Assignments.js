import { useState, useEffect} from "react";
import API from "../API";
import {Button, Table } from 'react-bootstrap';


export default function Assignments(props){
    const {taskId} = props
    const [usersAssigned, setUsersAssigned] = useState([]);
    const [dirty, setDirty] = useState(true)

    const deleteAssignment = (assignmentId) => {
        API.removeUser(taskId, assignmentId)
        .then(() => setDirty(true))
        .catch(err => console.log(err))
    }

    useEffect(()=>{
        if(dirty){
            API.getUsersAssigned(taskId)
            .then(res => {
                setUsersAssigned(res)
                setDirty(false)
            })
            .catch( err => console.log(err))
        }

    }, [dirty])

    return( <> 
        Assigned to: 
        {usersAssigned.length > 0 && 
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {usersAssigned.map( x => <tr>
                    <td>{x.name}</td>
                    <td>{x.email}</td>
                    <td><Button onClick={() => deleteAssignment(x.id)}>delete</Button></td>
                    </tr>)}
                </tbody>
            </Table>} 
            </>)
}