import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./stores";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "./configs/themeToken";
// import './index.css'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import "./configs/axios";
import "./i18n";
import "antd/dist/reset.css";
import "./index.css";

dayjs.extend(utc);
dayjs.extend(timezone);
// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ConfigProvider>
    </QueryClientProvider>
  // </React.StrictMode>
);
