import { ReactNode, createContext } from 'react';

type IDContext = {
  id?: string|null,
  setID?: (value:string|null) => void,
};

export const idContext = createContext<IDContext>({});

type IDContextProps = {
  value: IDContext,
  children?: string|ReactNode|ReactNode[],
};

export function IDContextProvider(props:IDContextProps) {
  return (
    <idContext.Provider value={props.value}>
      {props.children}
    </idContext.Provider>
  );
}