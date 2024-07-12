import { createContext, useContext, useState } from "react";

const ModalControlContext = createContext({});

export const ModalControlProvider = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <ModalControlContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
      }}
    >
      {props.children}
    </ModalControlContext.Provider>
  );
};

export const useModalControl = () => {
  return useContext(ModalControlContext);
};
