import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

import LoginPage from './components/LoginPage.js';

import HeaderNav from './components/HeaderNav.js';
import Sidebar from './components/Sidebar.js';
import AddTask from './components/AddTask.js';
import TasksList from './components/TasksList.js';

import './App.css';

function App() {

	const [loggedIn, setLoggedIn] = useState(false);
	const [user, setUser] = useState('');

    const [collapsed, setCollapsed] = useState(false);
    const [updated, setUpdated] = useState(true);

    const [tasks, setTasks] = useState([]);

    const [filter, setFilter] = useState('all');

	useEffect(() => {
		// async function checkIfAuthed() {
		// 	const user = await API.getUserInfo();
		// 	if (user) {
		// 		setEmail(user.email);
		// 		setLoggedIn(true);
		// 	}
		// };

		// checkIfAuthed();
	}, [loggedIn]);
    


	return (
        <Router>
            <Container fluid className='noPad'>
                <Row>
                    <Col>
                        <HeaderNav collapsed={collapsed} setCollapsed={setCollapsed} loggedIn={loggedIn} setLoggedIn={setLoggedIn}  name={user.name} />
                    </Col>
                </Row>
                { loggedIn ? <>
                    <Row>
                    <Col md={4} >
                        <Sidebar collapsed={collapsed} setFilter={setFilter} loggedIn={loggedIn} updated={updated} setUpdated={setUpdated}/>
                    </Col>
                    <Col md={8}>
                        <Switch>
                            <Route exact path='/allyourtasks' render={() => <TasksList tasks={tasks} setTasks={setTasks} updated={updated} setUpdated={setUpdated} loggedIn={loggedIn} user={user} filter={filter}/> }/>
                            <Route exact path='/all' render={() => <TasksList tasks={tasks} setTasks={setTasks} updated={updated} setUpdated={setUpdated} loggedIn={loggedIn} user={user} filter={filter}/> }/>
                            <Route exact path='/today' render={() => <TasksList tasks={tasks} setTasks={setTasks} updated={updated} setUpdated={setUpdated} loggedIn={loggedIn} user={user} filter={filter}/> }/>
                            <Route exact path='/next7days' render={() => <TasksList tasks={tasks} setTasks={setTasks} updated={updated} setUpdated={setUpdated} loggedIn={loggedIn} user={user} filter={filter}/> }/>
                            <Route exact path='/important' render={() => <TasksList tasks={tasks} setTasks={setTasks} updated={updated} setUpdated={setUpdated} loggedIn={loggedIn} user={user} filter={filter}/> }/>
                            <Route exact path='/login'><Redirect to='/allyourtasks'/></Route>
                        </Switch>
                    </Col>
                    </Row>
                    </>
                    :
                    <>
                    <Container>
                        <Switch>
                            <Route exact path='/public' render={() => <TasksList tasks={tasks} setTasks={setTasks} updated={updated} setUpdated={setUpdated} loggedIn={loggedIn} user={user} filter={filter}/> }/>
                            <Route exact path='/login' render={() => <LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUser={setUser} setUpdated={setUpdated} /> }/>
                            <Route exact path='/'><Redirect to='/public'/></Route>
                            <Route exact path='/all'><Redirect to='/public'/></Route>
                            <Route exact path='/today'><Redirect to='/public'/></Route>
                            <Route exact path='/next7days'><Redirect to='/public'/></Route>
                            <Route exact path='/important'><Redirect to='/public'/></Route>
                        </Switch>
                    </Container>
                    </>}

                {loggedIn && <AddTask setTasks={setTasks} setUpdated={setUpdated} />}

            </Container>
        </Router>
    );
}

export default App;
