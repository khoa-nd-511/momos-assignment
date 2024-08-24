import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

interface IDropdownContext {
  open: boolean;
  position: [number, number];
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  setPosition: Dispatch<React.SetStateAction<[number, number]>>;
}

function noop() {}

const DropdownContext = createContext<IDropdownContext>({
  open: false,
  position: [0, 0],
  setOpen: noop,
  setPosition: noop,
});

const DropdownContextProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </DropdownContext.Provider>
  );
};

export function useDropdownContext() {
  return useContext(DropdownContext);
}

export default DropdownContextProvider;
