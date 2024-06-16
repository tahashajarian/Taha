import { createContext, useContext, useState } from "react";

const CharacterAnimationsContext = createContext({});

export const CharacterAnimationsProvider = (props) => {
  const [animation, setAnimation] = useState();
  const [animations, setAnimations] = useState([]);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);

  return (
    <CharacterAnimationsContext.Provider
      value={{
        animation,
        setAnimation,
        animations,
        setAnimations,
        position,
        rotation,
        setRotation,
        setPosition,
      }}
    >
      {props.children}
    </CharacterAnimationsContext.Provider>
  );
};

export const useCharacterAnimations = () => {
  return useContext(CharacterAnimationsContext);
};
