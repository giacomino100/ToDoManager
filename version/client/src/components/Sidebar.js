import React from 'react';

import { NavLink } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";

import { useMediaQuery } from 'react-responsive';

import "./Sidebar.css";

const Sidebar = (props) => {
    const {loggedIn, setUpdated} = props;

    const isSmallScreen = useMediaQuery({ query: '(max-width: 767px)' });
    
    const computeStyle = () => {
        if (isSmallScreen && !props.collapsed) {
            return {
                height: 0,
                opacity: 0,
                transform: 'translateY(0)',
                transition: 'all .5s ease',
                overflow: 'hidden'
            }
        } else {
            return {
                height: '400px',
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all .5s ease',
                overflow: 'hidden'
            }
        }
    };
    
    const collapseStyle = computeStyle();

    return (
        <div className="editSidebar" style={collapseStyle}>
            {loggedIn ? 
            <>
            <NavLink to={{pathname: '/allyourtasks'}} className='nav-link' onClick={() => setUpdated(true)}>Manage your tasks</NavLink>
            <hr></hr>
            <p><b>Tasks assigned to you</b></p>
            <NavLink to={{pathname: '/all'}} className='nav-link' onClick={() => setUpdated(true)}>All</NavLink>
            <NavLink to={{pathname: '/today'}} className='nav-link' onClick={() => setUpdated(true)}>Today</NavLink>
            <NavLink to={{pathname: '/next7days'}} className='nav-link' onClick={() => setUpdated(true)}>Next 7 days</NavLink>
            <NavLink to={{pathname: '/important'}} className='nav-link'onClick={() => setUpdated(true)}>Important</NavLink>
            </>
            :
            <NavLink to={{pathname: '/public'}} className='nav-link' onClick={() => props.setFilter('public')}>Public</NavLink>
            }
        </div>
    );
};

export default Sidebar;
