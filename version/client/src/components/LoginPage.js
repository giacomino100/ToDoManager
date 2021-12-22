import React from 'react';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

import API from '../API';

const LoginPage = (props) => {

    const {setLoggedIn, setUpdated, setUser} = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [valid, setValid] = useState(true);

    const submit = async (e) => {
        e.preventDefault();

        setValid(true);
        
        const user = await API.logIn({ username: username, password: password});
        
        setUsername('');
        setPassword('');

        if (user) {
            setUser(user)
            setValid(true);
            setUpdated(true)
            setLoggedIn(true);
        }
        else
            setValid(false);
    };

    return (
        <Container>
            <br />
            <br />

            <Row>
                <Col className='d-flex justify-content-center'>
                    <h5>ToDo Manager</h5>
                </Col>
            </Row>
            
            { !valid && <Row>
                <Col className='d-flex justify-content-center'>
                    <Alert variant='danger'>Incorrect Email and/or Password.</Alert>
                </Col>
            </Row> }

            <Row className='d-flex justify-content-center'>
                <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Form onSubmit={submit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" onChange={(e) => setUsername(e.target.value)} value={username} required />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </Form.Group>

                        <Row>
                            <Col sm={8}>
                                <Button variant="dark" type="submit" block>
                                    Log in
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                </Card>
            </Row>

        </Container>
    );
};

export default LoginPage;