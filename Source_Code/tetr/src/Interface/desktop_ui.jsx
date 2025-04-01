import React, { Component } from 'react';

/*
    DesktopUI Component: React class component that serves as a wrapper for desktop UI elements. It applies
    a background color to the wrapped content.
*/


class DesktopUI extends Component {
    render(){
        const {children} = this.props;
        return(
            <div style={{backgroundColor: 'var(--gameboy-bgcolor)'}}>
                        {children}
            </div>
        )
    }
}

export default DesktopUI;