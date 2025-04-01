import React from 'react';
import './navigation_button.css';

/*
    NavigationButton Component: Renders a customizable button element.
    The component accepts various props to customize its behavior and appearance.
*/

class NavigationButton extends React.Component {
    render() {
        const { onClick, children, className, title } = this.props;
        return (
            <button className={`navigation-button ${className}`} onClick={onClick} title={title}>
                {children}
            </button>
        );
    }
}

export default NavigationButton;