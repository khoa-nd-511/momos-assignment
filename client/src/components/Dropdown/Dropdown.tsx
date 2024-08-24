import { MouseEventHandler, PropsWithChildren } from "react";
import DropdownContextProvider, { useDropdownContext } from "./context";

const DropdownWrapper = (props: PropsWithChildren) => {
  const { children, ...rest } = props;
  return (
    <DropdownContextProvider>
      <Dropdown {...rest}>{children}</Dropdown>
    </DropdownContextProvider>
  );
};

const DropdownTriggerer = ({ children }: PropsWithChildren) => {
  const { setOpen, setPosition } = useDropdownContext();
  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    const { x, y, height, width } = e.currentTarget.getBoundingClientRect();

    setPosition([x + width, y + height]);
    setOpen((v) => !v);
  };
  return (
    <div role="button" onClick={handleClick}>
      {children}
    </div>
  );
};

const DropdownContent = ({ children }: PropsWithChildren) => {
  const {
    open,
    position: [left, top],
  } = useDropdownContext();

  if (!open) return null;

  return (
    <div
      className="bg-slate-50 fixed z-20 shadow-md px-8 py-4 flex flex-col gap-2"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

const Dropdown = ({ children }: PropsWithChildren) => {
  const { open, setOpen } = useDropdownContext();
  return (
    <>
      <div className="inline-block">{children}</div>
      {open && (
        <div
          className="fixed top-0 left-0 w-full h-full z-10"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

DropdownWrapper.Triggerer = DropdownTriggerer;
DropdownWrapper.Content = DropdownContent;

export default DropdownWrapper;
