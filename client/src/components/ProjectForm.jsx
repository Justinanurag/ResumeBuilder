import { ProjectorIcon, Plus, Trash2 } from "lucide-react";
import React from "react";

const ProjectForm = ({ data, onChange }) => {
  // ➕ Add new project
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  // ❌ Remove a project
  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // 🔄 Update project field
  const updateProject = (index, field, value) => {
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
            <ProjectorIcon className="w-5 h-5 text-purple-600" />
            Projects
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Add your key academic or personal projects
          </p>
        </div>

        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3.5 py-1.5 text-sm bg-green-100 text-green-700 
          rounded-lg hover:bg-green-200 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-6 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-xl space-y-4 bg-gray-50"
          >
            {/* Project Header */}
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-800">
                Project #{index + 1}
              </h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Input Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                type="text"
                placeholder="Project Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <input
                value={project.type || ""}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                type="text"
                placeholder="Project Type (e.g. Web App, Android App)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <textarea
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                type="text"
                placeholder="Brief description of the project"
                className="md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;
