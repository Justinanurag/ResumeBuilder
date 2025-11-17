import React, { useEffect, useMemo, useState } from "react";
import { LoaderCircleIcon, SparklesIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../configs/api";

export const atsScorePrompt = `
You are an Applicant Tracking System scoring assistant. Compare a resume to a job description and return JSON:
{
  "score": 0-100 integer,
  "verdict": "1 sentence summary of the match",
  "strengths": ["bullet", "..."],
  "gaps": ["bullet", "..."],
  "recommendations": ["bullet", "..."],
  "keyword_alignment": [
    { "keyword": "", "match": 0-100 }
  ]
}
Use concise, energetic language. Never include text outside the JSON object.
`.trim();

const getMeterColors = (score) => {
  if (score >= 80) return { pathColor: "#10b981", textClass: "text-emerald-500" };
  if (score >= 60) return { pathColor: "#fbbf24", textClass: "text-amber-500" };
  if (score >= 40) return { pathColor: "#fb923c", textClass: "text-orange-500" };
  return { pathColor: "#f43f5e", textClass: "text-rose-500" };
};

const AtsModal = ({ isOpen, onClose, token, resumes = [] }) => {
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  const hasResumes = resumes.length > 0;

  const defaultResumeId = useMemo(
    () => (resumes.length ? resumes[0]._id : ""),
    [resumes]
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedResumeId(defaultResumeId);
      setScoreResult(null);
      setJobDescription("");
    }
  }, [isOpen, defaultResumeId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasResumes) return toast.error("Create or import a resume first.");
    if (!selectedResumeId) return toast.error("Select a resume first.");
    if (!jobDescription.trim()) return toast.error("Paste job description first.");

    setIsLoading(true);
    try {
      const { data } = await api.post(
        "/api/ai/ats-score",
        { resumeId: selectedResumeId, jobDescription },
        { headers: { Authorization: token } }
      );
      setScoreResult(data?.result || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const activeScore = scoreResult?.score ?? 0;
  const { pathColor, textClass } = getMeterColors(activeScore);

  const meterStyle = {
    background: `conic-gradient(${pathColor} ${activeScore * 3.6}deg, #E2E8F0 ${activeScore * 3.6}deg 360deg)`,
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(atsScorePrompt);
      setIsPromptCopied(true);
      setTimeout(() => setIsPromptCopied(false), 2000);
    } catch {
      toast.error("Copy failed.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <XIcon className="size-5" />
        </button>

        <div className="grid gap-8 px-6 py-10 md:px-8 lg:grid-cols-[1.1fr,0.9fr]">
          {/* Left Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <header>
              <p className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-600">
                <SparklesIcon className="size-3.5" />
                Smart ATS Check
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                Compare your resume with any job post in seconds
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Paste the job description and get instant insights.
              </p>
            </header>

            {/* Resume Select */}
            <label className="block text-sm font-medium text-slate-700">
              Choose a resume
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
              >
                {hasResumes ? (
                  resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.title}
                    </option>
                  ))
                ) : (
                  <option>No resumes yet</option>
                )}
              </select>
            </label>

            {/* Job Description */}
            <label className="block text-sm font-medium text-slate-700">
              Target job description
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job responsibilities, required skills, tech stack..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading || !hasResumes}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {isLoading && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin text-white" />
              )}
              {isLoading ? "Scoring..." : "Analyze with ATS"}
            </button>
          </form>

          {/* Right Column */}
          <div className="space-y-6 rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-900/5">
            {/* Score Meter */}
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                ATS Score
              </p>

              <div className="relative flex h-48 w-48 items-center justify-center">
                <div
                  className="relative h-full w-full rounded-full bg-slate-100 p-1"
                  style={meterStyle}
                >
                  <div className="absolute inset-4 rounded-full bg-white shadow-inner" />
                </div>
                <div className="absolute flex h-32 w-32 items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5">
                  <p className={`text-5xl font-semibold ${textClass}`}>
                    {activeScore}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500">
                {isLoading
                  ? "Analyzing..."
                  : scoreResult?.verdict || "Run an analysis to see your match score."}
              </p>
            </div>

            {/* HIDDEN PROMPT REFERENCE */}
            {false && (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Prompt Reference
                    </p>
                    <p className="text-sm text-slate-500">
                      Use this optimized ATS prompt.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-purple-600"
                  >
                    {isPromptCopied ? "Copied!" : "Copy prompt"}
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-slate-900 overflow-hidden ring-1 ring-black/10 shadow-inner">
                  <div className="flex items-center gap-1 border-b border-slate-800 px-4 py-2 text-[10px] text-slate-400">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                    <span className="ml-2">ats-prompt.json</span>
                  </div>

                  <pre className="max-h-64 overflow-y-auto p-4 text-xs text-slate-100">
                    {atsScorePrompt}
                  </pre>
                </div>
              </div>
            )}

            {/* Strengths / Gaps / Recommendations */}
            {scoreResult && (
              <div className="space-y-4 text-sm text-slate-700">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Strengths
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {scoreResult.strengths?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Gaps
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {scoreResult.gaps?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Quick wins
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {scoreResult.recommendations?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {scoreResult.keyword_alignment?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Keyword alignment
                    </p>

                    <div className="mt-3 space-y-2">
                      {scoreResult.keyword_alignment.map(({ keyword, match }) => (
                        <div
                          key={keyword}
                          className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5"
                        >
                          <div className="flex justify-between text-xs font-semibold text-slate-500">
                            <span>{keyword}</span>
                            <span>{match}%</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{ width: `${match}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Overlay Loader */}
        {isLoading && (
          <div className="absolute inset-0 rounded-3xl bg-white/70 backdrop-blur-[1px]">
            <div className="flex h-full items-center justify-center gap-3 text-sm font-medium text-slate-500">
              <LoaderCircleIcon className="size-7 animate-spin text-purple-500" />
              Crunching ATS insights...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtsModal;
