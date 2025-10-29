import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import ResumeBuilder from "./pages/ResumeBuilder";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Preview from "./pages/Preview";
import api from "./configs/api";
import { login, setloading } from "./app/features/authSlice";
import {Toaster} from 'react-hot-toast'
import Login from "./pages/Login";

const App = () => {
  const dispatch = useDispatch();
  const getUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: token },
        });

        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
         dispatch(setloading(false));
      } else{
         dispatch(setloading(false));
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
      }
      dispatch(setloading(false));
    } 
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
    <Toaster/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="app" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="builder/:resumeId" element={<ResumeBuilder />} />
      </Route>
      <Route path="view/:resumeId" element={<Preview />} />
      {/* <Route path="login" element={<Login />} /> */}
    </Routes>
    </>
  );
};

export default App;
