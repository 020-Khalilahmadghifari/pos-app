import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="border-b-2 bg-[#009687] border-white text-white p-2 flex justify-between items-center ">
      <div className="logo flex justify-center items-center">
        <img className="size-[70px] mr-3" src="https://cdn.kasirpintar.co.id/gambar/logo_kasir_pintar_free.webp" alt="" />
        <div className="font-bold text-lg text-white">POSKasir</div>
      </div>
      {user && (
        <div className="flex items-center gap-4 text-white">
          <Link to="/">POS</Link>
          {user.role === "admin" && (
            <>
              <Link to="/products">Products</Link>  
            </>
          )}
          <Link to="/history">History</Link>

          <div className="">
            <Link to="/Module">Docs</Link>
          </div>

          <span>{user.name} ({user.role})</span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded text-red-50">Logout</button>
        </div>
      )}
    </nav>
  );
}
