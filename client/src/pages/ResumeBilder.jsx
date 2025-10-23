import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";

const ResumeBilder = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82f6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    const loadExistingResume = async () => {
      const resume = dummyResumeData.find((r) => r._id === resumeId);
      if (resume) {
        setResumeData(resume);
        document.title = `Editing Resume - ${resume.title}`;
      }
    };
    loadExistingResume();
  }, [resumeId]);

  const handleNext = () => {
    setActiveSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const handlePrev = () => {
    setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel (Form Section) */}
          <div className="relative lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-4">
            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="h-1 bg-gray-200 rounded-full" />
              <div
                className="h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full absolute top-0 left-0 transition-all duration-500"
                style={{
                  width: `${(activeSectionIndex / (sections.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Section Navigation */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-base font-semibold text-gray-700">
                {activeSection.name}
              </h2>

              <div className="flex items-center gap-2">
                {activeSectionIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="size-4" /> Previous
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition ${
                    activeSectionIndex === sections.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={activeSectionIndex === sections.length - 1}
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Section Content */}
            <div className="space-y-6">
              {activeSection.id === "personal" && (
                <PersonalInfoForm
                  data={resumeData.personal_info}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, personal_info: data }))
                  }
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}

              {activeSection.id === "summary" && (
                <div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Professional Summary
                  </h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={5}
                    placeholder="Write a brief professional summary..."
                    value={resumeData.professional_summary}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel (Preview Section) */}
          <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Resume Preview
            </h3>
            <div className="text-gray-600 text-sm">
              {/* Temporary Preview Placeholder */}
              <p>
                You can preview your resume here as you fill the form. Each section
                updates automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBilder;
