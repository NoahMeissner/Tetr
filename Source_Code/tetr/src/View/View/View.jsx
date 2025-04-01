import React from 'react';
import { useMediaQuery } from "react-responsive";
import MobileUI from "../../Interface/mobile_ui";
import DesktopUI from "../../Interface/desktop_ui";
import ControlsLayout from "../../Interface/components/controls/controls_layout/controls_layout";
import Router from "../../Model/PageRoutingModel";
import DeviceInfoContext from '../../Model/DeviceInfoContext';
import { ThemeProvider } from '../../Model/ThemeContext';
import './view.css';
import './theme.css'

/*
    View component: This component is responsible for rendering the appropriate UI based on the device type.
    Depending on the device, it renders either the MobileUI or DesktopUI component, providing a responsive
    user experience.
*/

function View() {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    return (
        <ThemeProvider>
            <DeviceInfoContext.Provider value={isMobile}>
                <div>
                    {isMobile ? (
                        <MobileUI>
                            <div className="posit prevent-select">
                                <div className="pad-container-view">
                                    <div className="row">
                                        <Router />
                                    </div>
                                    <div className="row">
                                        <ControlsLayout />
                                    </div>
                                </div>
                            </div>
                        </MobileUI>
                    ) : (
                        <DesktopUI>
                            <div className="posit">
                                <Router />
                            </div>
                        </DesktopUI>
                    )}
                </div>
            </DeviceInfoContext.Provider>
        </ThemeProvider>
    );
}

export default View;