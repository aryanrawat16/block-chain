import { Link, useNavigate } from "react-router-dom";
import { Vote, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 backdrop-blur bg-white/90">
      <Link to="/" className="flex items-center gap-2 font-bold text-gray-800">
        <span className="bg-brand-600 text-white rounded-lg p-1.5">
          <Vote size={16} />
        </span>
        Blockchain Voting
      </Link>

      <div className="flex items-center gap-2 text-sm">
        {!role && (
          <>
            <Link to="/login" className="text-gray-600 hover:text-brand-600 px-3 py-1.5 transition">
              Voter Login
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-brand-600 px-3 py-1.5 transition">
              Register
            </Link>
            <Link
              to="/admin/login"
              className="bg-gray-800 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition"
            >
              Admin
            </Link>
          </>
        )}
        {role === "voter" && (
          <>
            <Link to="/voter/dashboard" className="text-gray-600 hover:text-brand-600 px-3 py-1.5 transition">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
            >
              <LogOut size={14} /> Logout
            </button>
          </>
        )}
        {role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="text-gray-600 hover:text-brand-600 px-3 py-1.5 transition">
              Dashboard
            </Link>
            <Link to="/admin/blockchain" className="text-gray-600 hover:text-brand-600 px-3 py-1.5 transition">
              Blockchain
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
            >
              <LogOut size={14} /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
