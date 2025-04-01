import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './navbar.css';
import DeviceInfoContext from '../../../Model/DeviceInfoContext';

/*
    NavBar Component: Renders a navigation bar with dynamic styling based on device type.
    The navigation bar displays different key labels depending on whether the user is on a mobile device or a desktop.
 */

const NavBar = ({ navBarWidth }) => {
    const isMobile = useContext(DeviceInfoContext);

    return (
        <nav className={`nav-bar ${isMobile ? 'mobile' : ''}`} style={{ width: navBarWidth }}>
            <ul className="nav-links">
                <li className="nav-link-left">
                    <a href="#back">{isMobile ? 'Back (B)' : 'Back (Shift)'}</a>
                </li>
                <li className="nav-link-right">
                    <a href="#select">{isMobile ? '(A) Select' : '(Space) Select'}</a>
                </li>
            </ul>
        </nav>
    );
};

NavBar.propTypes = {
    navBarWidth: PropTypes.string.isRequired,
};

export default NavBar;