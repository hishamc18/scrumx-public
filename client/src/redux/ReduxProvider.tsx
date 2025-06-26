"use client";
import { ReactNode, FC } from "react";
import { Provider } from "react-redux";
import store from "./app/store";

interface StoreProviderProps {
    children: ReactNode;
}

const ReduxProvider: FC<StoreProviderProps> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;