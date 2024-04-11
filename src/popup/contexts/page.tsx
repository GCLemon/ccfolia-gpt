import { ReactNode, createContext } from 'react';

type PageContext = {
  page?: 'list'|'edit'|'pref',
  setPage?: (value:'list'|'edit'|'pref') => void,
};

export const pageContext = createContext<PageContext>({});

type PageContextProps = {
  value: PageContext,
  children?: string|ReactNode|ReactNode[],
};

export function PageContextProvider(props:PageContextProps) {
  return (
    <pageContext.Provider value={props.value}>
      {props.children}
    </pageContext.Provider>
  );
}