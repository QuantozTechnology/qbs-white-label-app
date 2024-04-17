import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

const AppStateContext = createContext<{
  isRegistered: boolean;
  setIsRegistered: Dispatch<SetStateAction<boolean>>;
  startDeviceVerification: boolean;
  setStartDeviceVerification: Dispatch<SetStateAction<boolean>>;
  triggerStartDeviceVerification: () => void;
}>({
  isRegistered: false,
  setIsRegistered: () => {},
  startDeviceVerification: false,
  setStartDeviceVerification: () => {},
  triggerStartDeviceVerification: () => {},
});

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [startDeviceVerification, setStartDeviceVerification] = useState(false);

  const triggerStartDeviceVerification = () => setStartDeviceVerification(true);

  return (
    <AppStateContext.Provider
      value={{
        isRegistered,
        setIsRegistered,
        startDeviceVerification,
        setStartDeviceVerification,
        triggerStartDeviceVerification,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
