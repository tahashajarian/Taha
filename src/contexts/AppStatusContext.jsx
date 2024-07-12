import { createContext, useContext, useState } from "react";

const AppStatusContext = createContext({});

export const AppStatusContextProvider = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isApploaded, setIsAppLoaded] = useState(false);

  return (
    <AppStatusContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
        isApploaded,
        setIsAppLoaded,
      }}
    >
      {props.children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatusContext = () => {
  return useContext(AppStatusContext);
};
