import React, { useEffect } from 'react';
import SquareFrame from "../../Interface/components/square_frame/square_frame";
import '../View/view.css';

/*
     WelcomeView Component: This component displays a welcome message with the title "Tetrjs".
*/

function WelcomeView({ navigationFunctions }) {
    useEffect(() => {
        // Set a timeout to navigate after 1 second
        const timer = setTimeout(() => {
            navigationFunctions.navigateToOption(0);
        }, 2000);

        // Clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, [navigationFunctions]);

    return (
        <SquareFrame showTetrisAnimation={false}>
            <h1>
                Tetrjs
            </h1>
            <h3>
                by Max and Noah
            </h3>
        </SquareFrame>
    );
}

export default WelcomeView;