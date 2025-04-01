import SquareFrame from "../../Interface/components/square_frame/square_frame";
import NavigationButton from "../../Interface/components/navigation_button/navigation_button";

/*
    GameEndView Component: This component renders the game over screen with the final score
    and options for the player to navigate. It displays the player's score prominently and provides
     a set of buttons for different actions, such as replaying the game or returning to the main menu.
*/


function GameEndView({score, options, navigationFunctions, selectedIndex }) {

     return (
        <SquareFrame showTetrisAnimation={true}>
            <h1>
                Score
            </h1>
            <h2>
                {score}
            </h2>

            {options.map((option, index) => (
                <NavigationButton 
                    key={index} 
                    onClick={() => navigationFunctions.navigateToOption(index)}
                    onMouseEnter={() => navigationFunctions.setSelectedIndex(index)}
                    className={`${index === selectedIndex ? 'selected' : ''}`}
                    >
                    {option.label}
                </NavigationButton>
            ))}
        </SquareFrame>
    )
}
export default GameEndView;