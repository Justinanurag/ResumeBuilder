import React from "react";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";

const ResumePreview = ({ data, template, accentColor, fontStyle = "roboto", classes = "" }) => {
  // Get font family from font style ID
  const getFontFamily = (fontId) => {
    const fontMap = {
      roboto: "'Roboto', sans-serif",
      lato: "'Lato', sans-serif",
      "open-sans": "'Open Sans', sans-serif",
      playfair: "'Playfair Display', serif",
      inter: "'Inter', sans-serif",
    };
    return fontMap[fontId] || fontMap.roboto;
  };

  const fontFamily = getFontFamily(fontStyle);

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log("Font Style:", fontStyle, "Font Family:", fontFamily);
  }

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} fontFamily={fontFamily} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} fontFamily={fontFamily} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} fontFamily={fontFamily} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} fontFamily={fontFamily} />;
    }
  };

  // Debugging: log data changes in dev only
  if (process.env.NODE_ENV === "development") {
    console.log("Resume Data:", data);
  }

  const printStyles = `
    #resume-preview * {
      font-family: ${fontFamily} !important;
    }
    
    @page {
      size: letter;
      margin: 0;
    }

    @media print {
      html,
      body {
        width: 8.5in;
        height: 11in;
        overflow: hidden;
        margin: 0;
        padding: 0;
      }

      body > * {
        visibility: hidden;
      }

      #resume-preview,
      #resume-preview * {
        visibility: visible;
        font-family: ${fontFamily} !important;
      }

      #resume-preview {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        box-shadow: none !important;
        border: none !important;
        background: white !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className="w-full bg-gray-100">
        <div
          id="resume-preview"
          className={`border border-gray-200 print:shadow-none print:border-none${classes}`}
        >
          {renderTemplate()}
        </div>
      </div>
    </>
  );
};

export default ResumePreview;
