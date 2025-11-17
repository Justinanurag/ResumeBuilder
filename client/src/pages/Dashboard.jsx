import React, { useEffect, useState } from "react";
import {
  FilePenLine,
  Plus,
  Upload,
  Trash2,
  Edit3,
  X,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";
import pdfToText from "react-pdftotext";
import Swal from "sweetalert2";
import AtsModal from "../modals/atsModal";
import ThemeToggle from "../components/ThemeToggle";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load resumes
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resume || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resumes");
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  // Create Resume
  const createResume = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Resume title is required");

    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );
      setAllResumes((prev) => [...prev, data.resume]);
      toast.success("Resume created successfully!");
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create resume");
    }
  };

  // Upload Resume
  const uploadResume = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a PDF file");
    if (!title.trim()) return toast.error("Please enter a resume title");

    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return toast.error("Only PDF files are allowed");

    setIsLoading(true);
    try {
      const resumeText = await pdfToText(file);
      if (!resumeText?.trim()) throw new Error("Could not extract text from PDF");

      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title: title.trim(), resumeText },
        { headers: { Authorization: token } }
      );

      toast.success(data?.message || "Resume uploaded & parsed successfully!");
      setAllResumes((prev) => [...prev, data.data]);
      setTitle("");
      setFile(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data?.resumeId || data.data._id}`);
    } catch (error) {
      toast.error(error.message || "Failed to upload resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Resume
  const deleteResume = async (resumeId) => {
    const result = await Swal.fire({
      title: "Delete Resume?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: { Authorization: token },
      });
      setAllResumes((prev) => prev.filter((r) => r._id !== resumeId));
      toast.success("Resume deleted");
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  // Edit Title
  const editTitle = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title cannot be empty");

    try {
      const { data } = await api.put(
        "/api/resumes/update",
        { resumeId: editResumeId, title },
        { headers: { Authorization: token } }
      );
      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title } : r))
      );
      toast.success("Title updated");
      setEditResumeId("");
      setTitle("");
    } catch (error) {
      toast.error("Failed to update title");
    }
  };

  const handleAtsModalOpen = () => {
    if (!allResumes.length) {
      toast.error("Create or upload a resume first");
      return;
    }
    setShowAtsModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your resumes or create a new one to get started.
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => setShowCreateResume(true)}
              className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-10 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                <Plus className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Create New</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Build from scratch</p>
            </button>

            <button
              onClick={() => setShowUploadResume(true)}
              className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-10 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Upload Resume</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Import existing PDF</p>
            </button>

            <button
              onClick={handleAtsModalOpen}
              className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-10 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">ATS Checker</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check compatibility</p>
            </button>
          </div>

          {/* Resumes Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Resumes</h2>

            {allResumes.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No resumes yet</p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Create or upload your first resume to begin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allResumes.map((resume) => (
                  <div
                    key={resume._id}
                    onClick={() => navigate(`/app/builder/${resume._id}`)}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <FilePenLine className="w-9 h-9 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate px-4">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {resume.updatedAt
                          ? new Date(resume.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently created"}
                      </p>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditResumeId(resume._id);
                          setTitle(resume.title);
                        }}
                        className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <Edit3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResume(resume._id);
                        }}
                        className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Create Resume Modal */}
      {showCreateResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              setShowCreateResume(false);
              setTitle("");
            }}
            className="absolute inset-0"
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <button
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Resume</h2>
            <form onSubmit={createResume}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Frontend Engineer Resume"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                autoFocus
              />
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateResume(false);
                    setTitle("");
                  }}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                >
                  Create Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <button
              onClick={() => {
                setShowUploadResume(false);
                setFile(null);
                setTitle("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Existing Resume</h2>
            <form onSubmit={uploadResume}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your resume a title"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 mb-4"
              />
              <label className="block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="pdf-upload"
                />
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                  {file ? (
                    <p className="text-green-600 dark:text-green-400 font-medium">{file.name}</p>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">Click to upload PDF resume</p>
                    </>
                  )}
                </div>
              </label>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadResume(false);
                    setFile(null);
                    setTitle("");
                  }}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !file}
                  className="flex-1 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLoading ? "Uploading..." : "Upload & Parse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Title Modal */}
      {editResumeId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <button
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rename Resume</h2>
            <form onSubmit={editTitle}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                autoFocus
              />
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditResumeId("");
                    setTitle("");
                  }}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  Update Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AtsModal
        isOpen={showAtsModal}
        onClose={() => setShowAtsModal(false)}
        resumes={allResumes}
        token={token}
      />
    </>
  );
};

export default Dashboard;