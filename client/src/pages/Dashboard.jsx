import React, { useEffect, useState } from "react";
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load Dummy Resume Data
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: {
          Authorization: token,
        },
      });
      setAllResumes(data.resume);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  // ✅ Create Resume
  const createResume = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      // console.log("There is error ",error.message)
    }
  };

  // ✅ Upload Resume
  const uploadResume = async (e) => {
    e.preventDefault();
    if (!file.name.endsWith(".pdf")) {
      toast.error("Please upload a PDF file only.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const resumetext = await pdfToText(file);
      const { data } = await api.post(
        "/api/resumes/create",
        { title, resumetext },
        { headers: { Authorization: token } }
      );

      setTitle("");
      setFile(null);
      setIsLoading(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setIsLoading(false);
    }
  };

  // Delete Resume
  const deleteResume = async (resumeId) => {
    if (!token) {
      toast.error("You are not authorized!");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: { Authorization: token },
      });

      setAllResumes((prev) => prev.filter((resume) => resume._id !== resumeId));

      toast.success(data.message || data.msg || "Resume deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Edit Resume Title
  const editTitle = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (!token) {
      toast.error("You are not authorized!");
      return;
    }

    try {
      const { data } = await api.put(
        `/api/resumes/update`,
        { resumeId: editResumeId},
        {resumeData:{title}},
        {
          headers: { Authorization: token },
        }
      );

     setAllResumes(allResumes.map(resume=>resume._id===editResumeId ?{...resume,title}:resume))
     setEditResumeId("");
     setTitle("");
      toast.success(data.message || "Resume title updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Text */}
      <p className="text-2xl text-transparent font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text sm:hidden">
        Welcome, Anurag Tiwari
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {/* Create Resume */}
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-400 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
            Create Resume
          </p>
        </button>

        {/* Upload Existing */}

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-400 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-purple-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
            Upload Existing
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      {/* Resume Cards */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];

          return (
            <button
              key={index}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + "40",
              }}
            >
              <FilePenLineIcon
                className="size-7 group-hover:scale-105 transition-all"
                style={{ color: baseColor }}
              />
              <p
                className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                style={{ color: baseColor }}
              >
                {resume.title}
              </p>

              <p
                className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                style={{ color: baseColor + "90" }}
              >
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              {/* Edit/Delete Icons */}
              <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1">
                <TrashIcon
                  onClick={() => deleteResume(resume._id)}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume._id);
                    setTitle(resume.title);
                  }}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ✅ Create Resume Modal */}
      {showCreateResume && (
        <div
          onClick={() => setShowCreateResume(false)}
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10"
        >
          <form
            onSubmit={createResume}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border shadow-lg rounded-2xl w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Create a Resume
            </h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your Resume Title"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              Create Resume
            </button>

            <XIcon
              size={20}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
            />
          </form>
        </div>
      )}

      {/* ✅ Upload Resume Modal */}
      {showUploadResume && (
        <div
          onClick={() => setShowUploadResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm bg-opacity-50 z-10 flex items-center justify-center"
        >
          <form
            onSubmit={uploadResume}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border shadow-lg rounded-2xl w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Upload Resume
            </h2>

            <input
              type="text"
              placeholder="Enter resume title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Upload Box */}
            <label
              htmlFor="resume-file"
              className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:text-green-700 cursor-pointer transition-colors"
            >
              {file ? (
                <p className="text-green-700">{file.name}</p>
              ) : (
                <>
                  <UploadCloudIcon className="size-14 stroke-1" />
                  <p>Click to Upload Resume</p>
                </>
              )}
            </label>

            <input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />

            {file && (
              <p className="text-xs text-gray-500 text-center mb-4">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              {" "}
              {isLoading && (
                <LoaderCircleIcon className="animate-spin size-4 text-white" />
              )}
              {isLoading ? "uploading...." : "Upload Resume"}
            </button>

            <XIcon
              size={20}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              onClick={() => setShowUploadResume(false)}
            />
          </form>
        </div>
      )}

      {/* ✅ Edit Resume Modal */}
      {editResumeId && (
        <div
          onClick={() => {
            setEditResumeId("");
            setTitle("");
          }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10"
        >
          <form
            onSubmit={editTitle}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border shadow-lg rounded-2xl w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Edit Resume Title
            </h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new Resume Title"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              Update
            </button>

            <XIcon
              size={20}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
