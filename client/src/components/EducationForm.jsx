import { GraduationCap, Plus, Trash2 } from "lucide-react";
import React from "react";

const EducationForm = ({ data, onChange }) => {
  // ➕ Add new education
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      start_date: "",
      graduation_date: "",
      gpa: "",
      is_current: false,
    };
    onChange([...data, newEducation]);
  };

  // ❌ Remove education
  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // 🔄 Update field
  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Education
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Add your education details below
          </p>
        </div>

        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3.5 py-1.5 text-sm bg-green-100 text-green-700 
          rounded-lg hover:bg-green-200 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-base">No education added yet.</p>
          <p className="text-sm text-gray-400">
            Click “Add Education” to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-xl space-y-4 bg-gray-50"
            >
              {/* Education Header */}
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">
                  Education #{index + 1}
                </h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Input Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={education.institution || ""}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="Institution Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  value={education.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="Degree (e.g., Bachelor's, Master's)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  value={education.field || ""}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="Field of Study"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  value={education.graduation_date || ""}
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  type="month"
                  placeholder="Graduation Date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100"
                />
              </div>

              {/* GPA Field */}
              <input
                value={education.gpa || ""}
                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                type="text"
                placeholder="GPA (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
