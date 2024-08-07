import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./App.css";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		{/* use ConfigProvider for global UI customization */}
		<ConfigProvider
			theme={{
				token: {
					fontFamily: "Noto Sans Thai",
					motion: true,
					colorPrimary: "#BF40BF",
				},
			}}>
			<HashRouter>
				<App />
			</HashRouter>
		</ConfigProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
