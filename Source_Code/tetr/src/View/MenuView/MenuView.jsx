import SquareFrame from "../../Interface/components/square_frame/square_frame";
import NavigationButton from "../../Interface/components/navigation_button/navigation_button";

/*
    MenuView Component: This component renders a menu with a list of options, each represented by a button.
    The user can navigate through the options using the provided navigation functions.
*/

const MenuView = ({ options, navigationFunctions, selectedIndex }) => {
  return (
      <SquareFrame showTetrisAnimation={false}>
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
  );
};

export default MenuView;
