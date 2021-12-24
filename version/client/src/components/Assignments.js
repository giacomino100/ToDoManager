import { useState, useEffect} from "react";
import API from "../API";
import { Button, Table, Col, Form, Row, Modal } from 'react-bootstrap';


function ModalAddAssignment(props) {

    const {taskId, showAddAssignment, handleClose, setDirty} = props;
    const [users, setUsers] = useState([])
    const [userSelected, setUserSelected] = useState({})

    useEffect(() => {
        API.getUsers()
        .then((res) => setUsers(res))
        .catch(err => console.log(err))
    }, [])

    const submit = async (e) => {
        e.preventDefault();
        API.assignTaskToUser(taskId, userSelected)
        .then((res) => {
            setDirty(true)
            handleClose()
        })
        .catch(err => console.log(err))
    }

    return (
        <Modal show={showAddAssignment} onHide={handleClose} backdrop="static">

            <Modal.Header closeButton>
                <Modal.Title>Assign Task</Modal.Title>
            </Modal.Header>

            <Form onSubmit={submit}>
                <Modal.Body>
    
                <Form.Group className="mb-3">
                    <Form.Label>Users menu</Form.Label>
                    <Form.Select>
                        {users.map( u => <option value={u.name} onClick={() => setUserSelected(u)}>{u.name}</option>)}
                    </Form.Select>
                </Form.Group>
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



export default function Assignments(props){
    const {taskId} = props
    const [usersAssigned, setUsersAssigned] = useState([]);
    const [dirty, setDirty] = useState(true)

    
    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const handleCloseAddAssignment = () => setShowAddAssignment(false);
    const handleShowAddAssignment = () => setShowAddAssignment(true);

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
        <Row className="justify-content-end">
            <Col>
                Assigned to {usersAssigned.length == 0 ? 'nobody' : `${usersAssigned.length} people`}
            </Col>
            <Col>
                <Button style={{fontSize: '11pt'}} onClick={() => setShowAddAssignment(true)}>Add assignments</Button>
            </Col>
        </Row>

        {usersAssigned.length > 0 && <>
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
            </Table></>} 
        <ModalAddAssignment showAddAssignment={showAddAssignment} handleClose={handleCloseAddAssignment} handleShow={handleShowAddAssignment} taskId={taskId} setDirty={setDirty}></ModalAddAssignment>
            </>)
}