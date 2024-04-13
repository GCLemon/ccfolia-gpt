import { ReactNode, createContext } from 'react';

type OnMessageContext = {
  onMessage?: (response:any)=>void,
  setOnMessage?: (value:(response:any)=>void) => void,
};

export const onMessageContext = createContext<OnMessageContext>({});

type OnMessageContextProps = {
  value: OnMessageContext,
  children?: string|ReactNode|ReactNode[],
};

export function OnMessageContextProvider(props:OnMessageContextProps) {
  return (
    <onMessageContext.Provider value={props.value}>
      {props.children}
    </onMessageContext.Provider>
  );
}