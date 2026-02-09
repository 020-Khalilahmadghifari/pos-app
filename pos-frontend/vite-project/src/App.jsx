import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import POS from "./pages/POS";
import Products from "./pages/Products";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Module from "./module/Module";

function PrivateRoute({ children, role }) {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role && role !== "all") return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute role="all"><POS /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute role="admin"><Products /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute role="all"><History /></PrivateRoute>} />
          <Route path="/module" element={<PrivateRoute role="all"><Module /></PrivateRoute>}/>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
