import { createContext, useContext, useState, useEffect } from "react";

const AppStatusContext = createContext({});

export const AppStatusContextProvider = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isApploaded, setIsAppLoaded] = useState(false);
  const [paintModalIsPoen, setPaintModalIsOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth <= 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppStatusContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
        isApploaded,
        setIsAppLoaded,
        paintModalIsPoen,
        setPaintModalIsOpen,
        isMobileDevice,
        curtainOpen,
        setCurtainOpen,
      }}
    >
      {props.children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatusContext = () => {
  return useContext(AppStatusContext);
};
