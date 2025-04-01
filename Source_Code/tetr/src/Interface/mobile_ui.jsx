import React, { Component } from 'react';

/*
    MobileUI Component: React class component that serves as a wrapper for mobile UI elements. It applies
    a background color to the wrapped content.
 */

class MobileUI extends Component {
    render(){
        const {children} = this.props;
        return(
            <div style={{backgroundColor: 'var(--gameboy-bgcolor)'}}>
                {children}
            </div>
        )
    }
}

export default MobileUI;