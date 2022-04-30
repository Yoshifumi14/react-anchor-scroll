import React from "react";

import { useAnchorScroll } from "./AnchorScrollHook";

const Context = React.createContext<{
  elementsRefs: React.RefObject<HTMLDivElement>[];
  onClickMenu: (index: number) => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}>({
  elementsRefs: [],
  onClickMenu: () => {},
  scrollAreaRef: React.createRef<HTMLDivElement>(),
});

export type AnchorScrollContextProps = {
  elementsLength: number;
  setSelectedIndex: (index: number) => void;
};

export const AnchorScrollContext = React.memo<React.PropsWithChildren<AnchorScrollContextProps>>(
  function AnchorScrollContext({ elementsLength, setSelectedIndex, children }) {
    const { elementsRefs, onClickMenu, scrollAreaRef } = useAnchorScroll(elementsLength, setSelectedIndex);
    return <Context.Provider value={{ elementsRefs, onClickMenu, scrollAreaRef }}>{children}</Context.Provider>;
  }
);

type AnchorScrollAreaProps = {} & React.AreaHTMLAttributes<HTMLDivElement>;

export const AnchorScrollArea = React.memo<AnchorScrollAreaProps>(function AnchorScrollArea(props) {
  const ref = React.useContext(Context).scrollAreaRef;
  return <div {...props} ref={ref} />;
});

export type AnchorScrollElementProps = {
  index: number;
} & React.AreaHTMLAttributes<HTMLDivElement>;

export const AnchorScrollElement = React.memo<React.PropsWithChildren<AnchorScrollElementProps>>(
  function AnchorScrollElement({ index, ...otherProps }) {
    const ref = React.useContext(Context).elementsRefs[index];
    return <div {...otherProps} ref={ref} />;
  }
);

export type AnchorScrollMenusProps = {
  render: (onClickMenu: (index: number) => void) => React.ReactNode;
};

export const AnchorScrollMenus = React.memo<AnchorScrollMenusProps>(function AnchorScrollMenus({ render }) {
  const onClickMenu = React.useContext(Context).onClickMenu;
  return <>{render(onClickMenu)}</>;
});
