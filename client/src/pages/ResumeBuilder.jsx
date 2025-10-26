import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeClosed,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/colorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForms from "../components/SkillsForms";

const ResumeBuilder = () => {
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
    accent_color: "#3B82F6",
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
    const resume = dummyResumeData.find((r) => r._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = `Editing Resume - ${resume.title}`;
    }
  }, [resumeId]);

  const handleNext = () =>
    setActiveSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrev = () =>
    setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
  const changeResumeVisibility = async () => {
    setResumeData({ ...resumeData, public: !resumeData.public });
  };
  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      alert("Share not supported on this browser. ");
    }
  };
  const downloadResume = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-600 hover:text-slate-800 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="h-1 bg-gray-200 rounded-full" />
              <div
                className="h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full absolute top-0 left-0 transition-all duration-500"
                style={{
                  width: `${
                    (activeSectionIndex / (sections.length - 1)) * 100
                  }%`,
                }}
              />
            </div>

            {/* Header Controls */}
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-200 pb-3 mb-6">
              {/* Removed "Personal Info" text */}

              <div className="flex items-center gap-2">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData((prev) => ({ ...prev, template }))
                  }
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData((prev) => ({
                      ...prev,
                      accent_color: color,
                    }))
                  }
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                {activeSectionIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="size-4" /> Prev
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={activeSectionIndex === sections.length - 1}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition ${
                    activeSectionIndex === sections.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Form Section */}
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
                <ProfessionalSummaryForm
                  data={resumeData.professional_summary}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      professional_summary: data,
                    }))
                  }
                  setResumeData={setResumeData}
                />
              )}
              {activeSection.id === "experience" && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, experience: data }))
                  }
                />
              )}
              {activeSection.id === "education" && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, education: data }))
                  }
                />
              )}
              {activeSection.id === "projects" && (
                <ProjectForm
                  data={resumeData.project}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, project: data }))
                  }
                />
              )}
              {activeSection.id === "skills" && (
                <SkillsForms
                  data={resumeData.skills}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, skills: data }))
                  }
                />
              )}
            </div>
            <button className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm">
              Save changes
            </button>
          </div>

          {/* Right Panel (Preview) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-md border border-gray-100 p-6 relative">
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              {/* Share button (only visible if public) */}
              {resumeData.public && (
                <button
                onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 
        bg-blue-50 hover:bg-blue-100 rounded-lg shadow-sm transition-all duration-200"
                >
                  <Share2Icon className="w-4 h-4" />
                  Share
                </button>
              )}

              {/* Public/Private Toggle */}
              <button
              onClick={changeResumeVisibility}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 
        ${
          resumeData.public
            ? "text-green-600 bg-green-50 hover:bg-green-100"
            : "text-purple-600 bg-purple-50 hover:bg-purple-100"
        }`}
              >
                {resumeData.public ? (
                  <EyeIcon className="w-4 h-4" />
                ) : (
                  <EyeOffIcon className="w-4 h-4" />
                )}
                {resumeData.public ? "Public" : "Private"}
              </button>

              {/* Download Button */}
              <button
              onClick={downloadResume}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 
      bg-purple-50 hover:bg-purple-100 rounded-lg shadow-sm transition-all duration-200"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* Resume Preview */}
            <div className="mt-16">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
