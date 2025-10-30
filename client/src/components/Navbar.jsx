import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"

const Navbar = () => {
  // const user = { name: "Anurag Tiwari" };

  const user = useSelector(state=>state.auth);
  // console.log(user)
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const logoutUser = () => {
    localStorage.removeItem("token")
    localStorage.clear();
    navigate("/");
    dispatch(logout())
  };

  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Hi, {user.user?.name}</p>
          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
