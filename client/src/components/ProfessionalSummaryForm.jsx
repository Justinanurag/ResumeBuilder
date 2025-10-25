import { Sparkles } from "lucide-react";
import React from "react";

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Add summary for your resume here    
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3.5 py-1.5 text-sm bg-purple-100 text-purple-700 
          rounded-lg hover:bg-purple-200 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Enhance</span>
        </button>
      </div>

      {/* Textarea Section */}
      <div>
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className="w-full p-4 border border-gray-300 rounded-lg text-sm text-gray-800 
          focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 Tip: Keep it concise (3–4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
