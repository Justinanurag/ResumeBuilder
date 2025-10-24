import Home from "./pages/Home";
import React from "react";
import { Route, Routes } from "react-router-dom";
import ResumeBulider from "./pages/ResumeBuilder";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Preview from "./pages/Preview";
import Login from "./pages/Login";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBulider />} />
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />
        <Route path="login" element={<Login/>} />
      </Routes>
    </>
  );
};

export default App;
