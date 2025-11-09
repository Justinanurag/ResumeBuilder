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
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForms from "../components/SkillsForms";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const { token } = useSelector((state) => state.auth);

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
  const [isDownloading, setIsDownloading] = useState(false);

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
      try {
        const { data } = await api.get("/api/resumes/get/" + resumeId, {
          headers: {
            Authorization: token,
          },
        });

        if (data.resume) {
          setResumeData(data.resume);
          document.title = data.resume.title;
          return data.resume;
        }
        return null;
      } catch (error) {
        console.log("Error loading resume:", error.response?.data?.message || error.message);
        return null;
      }
    };

    (async () => {
      const res = await loadExistingResume();

      if(!res){   // if DB resume not found then use dummy
        const dummy = dummyResumeData.find(r => r._id === resumeId);
        if(dummy){
          setResumeData(dummy);
          document.title = `Editing Resume - ${dummy.title}`;
        }
      }
    })();
  }, [resumeId, token]);


  const handleNext = () =>
    setActiveSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrev = () =>
    setActiveSectionIndex((prev) => Math.max(prev - 1, 0));

  const changeResumeVisibility = async () => {
    try {
      if (!resumeId) {
        toast.error("Cannot update visibility: Resume ID is missing");
        return;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });

      if (data && data.success) {
        setResumeData((prev) => ({ ...prev, public: !prev.public }));
        toast.success(data.message || "Visibility updated successfully!");
      } else {
        toast.error("Failed to update visibility");
      }
    } catch (error) {
      console.log(
        "Error saving resume:",
        error?.response?.data || error.message
      );
      toast.error(error?.response?.data?.message || "Failed to update visibility");
    }
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
  const downloadResume = async () => {
    try {
      setIsDownloading(true);
      const resumeElement = document.getElementById("resume-preview");
      
      if (!resumeElement) {
        toast.error("Resume preview not found");
        setIsDownloading(false);
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");

      // Wait a bit to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the resume element dimensions
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Handle images in cloned document
          const clonedElement = clonedDoc.getElementById("resume-preview");
          if (clonedElement) {
            const images = clonedElement.getElementsByTagName("img");
            Array.from(images).forEach(img => {
              if (!img.complete) {
                img.style.display = "none";
              }
            });
          }
        },
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // A4 dimensions in mm
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      // Calculate scaling to fit page width
      const imgAspectRatio = imgWidth / imgHeight;
      const scaledWidth = pdfWidth;
      const scaledHeight = pdfWidth / imgAspectRatio;
      
      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      
      // If content fits on one page
      if (scaledHeight <= pdfHeight) {
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, scaledWidth, scaledHeight);
      } else {
        // Split across multiple pages
        const totalPages = Math.ceil(scaledHeight / pdfHeight);
        
        // Calculate pixel height per page
        const pageHeightPx = Math.ceil(imgHeight / totalPages);
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }
          
          // Calculate the Y position and height for this page
          const sourceY = page * pageHeightPx;
          const sourceHeight = Math.min(pageHeightPx, imgHeight - sourceY);
          const pageScaledHeight = (sourceHeight / imgHeight) * scaledHeight;
          
          // Create a canvas for this page's portion
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = imgWidth;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext("2d");
          
          // Draw the cropped portion onto the page canvas
          pageCtx.drawImage(
            canvas,
            0, sourceY, imgWidth, sourceHeight,
            0, 0, imgWidth, sourceHeight
          );
          
          // Add this page to PDF
          const pageImgData = pageCanvas.toDataURL("image/png");
          pdf.addImage(pageImgData, "PNG", 0, 0, scaledWidth, pageScaledHeight);
        }
      }

      // Generate filename
      const fileName = resumeData.title 
        ? `${resumeData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_resume.pdf`
        : "resume.pdf";

      // Save PDF
      pdf.save(fileName);
      
      toast.dismiss(loadingToast);
      toast.success("Resume downloaded successfully!");
      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume. Please try again.");
      setIsDownloading(false);
    }
  };

  const saveResume = async () => {
    try {
      // Check if resumeId exists
      if (!resumeData._id) {
        toast.error("Cannot save: Resume ID is missing");
        return;
      }

      let updatedResumeData = structuredClone(resumeData);

      // remove image field before sending JSON
      if (typeof updatedResumeData.personal_info?.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeData._id);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) formData.append("removeBackground", "yes");

      if (typeof resumeData.personal_info.image === "object") {
        formData.append("image", resumeData.personal_info.image);
      }

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: {
          Authorization: token,
        },
      });

      if (data && data.success && data.data) {
        setResumeData(data.data);
        toast.success(data.message || "Resume saved successfully!");
      } else {
        toast.error("Failed to save resume");
      }
    } catch (error) {
      console.log("Error in saving resume:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to save resume");
    }
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
                  setResumeData={setResumeData}
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
            <button
              onClick={() => {
                toast.promise(saveResume(), {
                  loading: "Saving...",
                  success: "Saved",
                  error: "Failed",
                });
              }}
              className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
            >
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
                disabled={isDownloading}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 
      bg-purple-50 hover:bg-purple-100 rounded-lg shadow-sm transition-all duration-200 ${
        isDownloading ? "opacity-50 cursor-not-allowed" : ""
      }`}
              >
                <DownloadIcon className="w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download"}
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
