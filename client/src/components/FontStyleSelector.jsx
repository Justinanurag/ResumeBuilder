import { Check, Type } from "lucide-react";
import React, { useState } from "react";

const FontStyleSelector = ({ selectedFont, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const fonts = [
    {
      id: "roboto",
      name: "Roboto",
      preview: "Clean and modern sans-serif font",
      fontFamily: "'Roboto', sans-serif",
    },
    {
      id: "lato",
      name: "Lato",
      preview: "Friendly and highly readable font",
      fontFamily: "'Lato', sans-serif",
    },
    {
      id: "open-sans",
      name: "Open Sans",
      preview: "Professional and versatile font",
      fontFamily: "'Open Sans', sans-serif",
    },
    {
      id: "playfair",
      name: "Playfair Display",
      preview: "Elegant serif for creative resumes",
      fontFamily: "'Playfair Display', serif",
    },
    {
      id: "inter",
      name: "Inter",
      preview: "Modern and clean sans-serif font",
      fontFamily: "'Inter', sans-serif",
    },
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Type size={14} /> <span className="max-sm:hidden">Font</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-64 p-3 mt-2 space-y-3 z-20 bg-white rounded-md border border-gray-200 shadow-sm">
          {fonts.map((font) => (
            <div
              key={font.id}
              onClick={() => {
                onChange(font.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border rounded-md cursor-pointer transition-all
              ${
                selectedFont === font.id
                  ? "border-blue-400 bg-blue-100"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {/* Check icon */}
              {selectedFont === font.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-1">
                <h4
                  className="font-medium text-gray-800"
                  style={{ fontFamily: font.fontFamily }}
                >
                  {font.name}
                </h4>

                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic">
                  {font.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontStyleSelector;
