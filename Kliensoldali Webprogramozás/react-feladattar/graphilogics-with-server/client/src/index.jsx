import React from "react";
import App from "./views/App";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import "./grafilogika.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from './state/store';
import { fetchList } from "./state/graphilogicsListSlice";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

store.dispatch({ type: "graphilogics/startGame" });

const unsubscribe = store.subscribe(() => console.log('State after dispatch:', store.getState()));

store.dispatch({ type: "graphilogics/startGame" });

unsubscribe();

store.dispatch(fetchList());
