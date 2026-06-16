import React from "react";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import { getFontFamily } from "../utils/fonts";

const ResumePreview = ({
  data,
  template,
  accentColor,
  fontStyle = "roboto",
  classes = "",
  pdfMode = false,
}) => {
  const fontFamily = getFontFamily(fontStyle);

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

  const previewClasses = pdfMode
    ? "bg-white shadow-lg mx-auto"
    : `border border-gray-200 print:shadow-none print:border-none${classes}`;

  const wrapperClasses = pdfMode ? "w-full" : "w-full bg-gray-100";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className={wrapperClasses}>
        <div
          id="resume-preview"
          className={previewClasses}
          style={pdfMode ? { width: "8.5in", minHeight: "11in" } : undefined}
        >
          {renderTemplate()}
        </div>
      </div>
    </>
  );
};

export default ResumePreview;
