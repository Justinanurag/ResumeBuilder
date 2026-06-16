import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { loadResumeFont } from "./fonts";

const PDF_FORMAT = "letter";

async function waitForImages(element) {
  const images = element.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalHeight > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          setTimeout(done, 8000);
        })
    )
  );
}

function sanitizeFileName(title) {
  if (!title) return "resume.pdf";
  const safe = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  return `${safe || "resume"}_resume.pdf`;
}

export async function generatePdfFromElement(
  element,
  { fileName, fontStyle = "roboto" } = {}
) {
  if (!element) {
    throw new Error("Resume preview element not found");
  }

  await loadResumeFont(fontStyle);
  await waitForImages(element);

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: -window.scrollY,
    width: element.scrollWidth,
    height: element.scrollHeight,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById("resume-preview");
      if (!clonedElement) return;

      clonedElement.style.boxShadow = "none";
      clonedElement.style.border = "none";
      clonedElement.style.margin = "0";
      clonedElement.style.padding = "0";
    },
  });

  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: PDF_FORMAT });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidthMM = pageWidth;
  const imgHeightMM = (canvas.height / canvas.width) * pageWidth;

  let position = 0;
  let heightLeft = imgHeightMM;

  pdf.addImage(imgData, "PNG", 0, position, imgWidthMM, imgHeightMM);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidthMM, imgHeightMM);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName || "resume.pdf");
}

export { sanitizeFileName };
