import { createContext, useContext, useState } from "react";

const CharacterAnimationsContext = createContext({});

export const CharacterAnimationsProvider = (props) => {
  const [animation, setAnimation] = useState();
  const [animations, setAnimations] = useState([]);

  return (
    <CharacterAnimationsContext.Provider
      value={{
        animation,
        setAnimation,
        animations,
        setAnimations,
      }}
    >
      {props.children}
    </CharacterAnimationsContext.Provider>
  );
};

export const useCharacterAnimations = () => {
  return useContext(CharacterAnimationsContext);
};
