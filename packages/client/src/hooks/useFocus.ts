import { useRef, RefObject } from 'react';

const useFocus = <T extends HTMLElement>(): [RefObject<T>, () => void] => {
  const htmlElementRef: RefObject<T> = useRef(null);
  const setFocus: () => void = () => {
    htmlElementRef?.current?.focus();
  };

  return [htmlElementRef, setFocus];
};

export { useFocus };
