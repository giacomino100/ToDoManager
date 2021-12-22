import React from 'react';
import { useState } from 'react'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Form, FormControl, Modal, Button } from 'react-bootstrap';

import pageLogo from '../res/logo.png';
import loginLogo from '../res/menu-login.png';

import './HeaderNav.css';
import API from '../API';

function ModalLogout(props) {

    const submit = async (e) => {
        e.preventDefault();

        API.logOut()
        .then(() => props.setLoggedIn(false))
        .then(() => props.handleClose())
        
    }
    
    return (
        <Modal show={props.show} onHide={props.handleClose}>

            <Modal.Header closeButton>
                <Modal.Title>Log out</Modal.Title>
            </Modal.Header>

            <Form onSubmit={submit}>
                <Modal.Body>
                <Form.Label >Are you sure to exit?</Form.Label>
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

const HeaderNav = (props) => {

    const {loggedIn, name} = props
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Navbar className='bg-dark' expand='md' >

                <Navbar.Toggle aria-controls='basic-navbar-nav' id='toggler' onClick={() => props.setCollapsed(oldcollapsed => !oldcollapsed)} />
                <h5 className='pageTitle'>
                    <img src={pageLogo} alt='' className='pageLogo'></img>
                        ToDo Manager
                    </h5>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Form inline>
                        <FormControl type='text' placeholder='Search' className='mr-sm-2' />
                    </Form>
                </Navbar.Collapse>

                {name && <h6 style={{ color: "white" }}> Logged in as: {name} </h6>}

                {loggedIn ? <img src={loginLogo} alt='' className='loginLogo' onClick={handleShow} ></img> : <a href="/login" ><img src={loginLogo} alt='' className='loginLogo' ></img></a>}

            </Navbar>
            <ModalLogout show={show} handleClose={handleClose} handleShow={handleShow} setLoggedIn={props.setLoggedIn} />
        </>
    );
};

export default HeaderNav;
