import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Login from "./pages/Login/Login.tsx";
import type { JSX } from "react";

function Router() {
	function PrivateRoute({ children }: { children: JSX.Element }) {
		const isAuthenticated = !!localStorage.getItem("session");
		return isAuthenticated ? children : <Navigate to="/" />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route
					path="/dashboard"
					element={<PrivateRoute children={<Dashboard />} />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default Router;
