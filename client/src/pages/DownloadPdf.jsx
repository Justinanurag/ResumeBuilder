import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeftIcon, DownloadIcon, Loader } from "lucide-react";
import toast from "react-hot-toast";
import ResumePreview from "../components/ResumePreview";
import api from "../configs/api";
import { generatePdfFromElement, sanitizeFileName } from "../utils/generatePdf";
import { loadResumeFont } from "../utils/fonts";

const DownloadPdf = () => {
  const { resumeId } = useParams();
  const [searchParams] = useSearchParams();
  const autoDownload = searchParams.get("auto") === "1";

  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const previewRef = useRef(null);
  const hasAutoDownloaded = useRef(false);

  useEffect(() => {
    const loadResume = async () => {
      if (!resumeId) return;

      setIsLoading(true);
      setLoadError(null);

      try {
        const { data } = await api.get("/api/resumes/public/" + resumeId);
        if (data.resume) {
          setResumeData(data.resume);
          return;
        }
      } catch {
        // Fall through to authenticated fetch
      }

      if (token) {
        try {
          const { data } = await api.get("/api/resumes/get/" + resumeId, {
            headers: { Authorization: token },
          });
          if (data.resume) {
            setResumeData(data.resume);
            return;
          }
        } catch (error) {
          setLoadError(error?.response?.data?.message || "Failed to load resume");
          return;
        }
      }

      setLoadError("Resume not found or is private");
    };

    loadResume().finally(() => setIsLoading(false));
  }, [resumeId, token]);

  useEffect(() => {
    if (!resumeData) return;

    const preparePreview = async () => {
      setIsReady(false);
      await loadResumeFont(resumeData.font_style || "roboto");
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsReady(true);
    };

    preparePreview();
  }, [resumeData]);

  const handleDownload = useCallback(async () => {
    const element = document.getElementById("resume-preview");
    if (!element) {
      toast.error("Resume preview not found");
      return;
    }

    const loadingToast = toast.loading("Generating PDF...");
    setIsDownloading(true);

    try {
      await generatePdfFromElement(element, {
        fileName: sanitizeFileName(resumeData?.title),
        fontStyle: resumeData?.font_style || "roboto",
      });
      toast.dismiss(loadingToast);
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to download resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [resumeData]);

  useEffect(() => {
    if (!autoDownload || !isReady || !resumeData || hasAutoDownloaded.current) return;
    hasAutoDownloaded.current = true;
    handleDownload();
  }, [autoDownload, isReady, resumeData, handleDownload]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 gap-3">
        <Loader className="animate-spin text-purple-600" size={40} />
        <p className="text-slate-600">Loading resume...</p>
      </div>
    );
  }

  if (loadError || !resumeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 px-4">
        <p className="text-center text-2xl text-slate-500 mb-6">
          {loadError || "Resume not found"}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Go to home
        </Link>
      </div>
    );
  }

  const backUrl = token ? `/app/builder/${resumeId}` : `/view/${resumeId}`;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            to={backUrl}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>

          <div className="text-center flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-800 truncate">
              {resumeData.title || "Resume"} — PDF Download
            </h1>
            <p className="text-sm text-slate-500">Letter size (8.5&quot; × 11&quot;)</p>
          </div>

          <button
            onClick={handleDownload}
            disabled={!isReady || isDownloading}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-all ${
              !isReady || isDownloading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDownloading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <DownloadIcon className="w-4 h-4" />
            )}
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!isReady && (
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-6">
            <Loader className="animate-spin size-4" />
            <span className="text-sm">Preparing fonts and layout...</span>
          </div>
        )}

        <div ref={previewRef} className="flex justify-center">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color || "#3B82F6"}
            fontStyle={resumeData.font_style || "roboto"}
            pdfMode
          />
        </div>
      </main>
    </div>
  );
};

export default DownloadPdf;
