import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function POSLayout() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Navbar /> {}
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}
