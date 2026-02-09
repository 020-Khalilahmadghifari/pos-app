import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/products");
    } catch (err) {
      alert("Login gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
    <form onSubmit={submit} className="bg-[#009687] p-10 mt-12 items-center justify-center max-w-sm mx-auto space-y-8 rounded-xl">
      <h2 className="text-xl font-bold text-white ">Login</h2>
      <input
        className="border p-3 w-full rounded-xl"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-3 w-full rounded-xl"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-yellow-400 text-white px-4 py-2 w-full rounded-xl font-bold">Login</button>
    </form> 
    <div className="flex justify-end items-end pr-10 pb-6">
      <div className="akun p-4 bg-[rgb(0,150,135)] max-w-max space-y-3 rounded-xl font-bold text-white ">
        <h1>Account</h1>
        <h1>admin : admin123</h1>
        <h1>kasir1 : 123456</h1>
      </div>
    </div>
    </>
    
    
  );
}
