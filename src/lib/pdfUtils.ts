import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Generate and download a PDF from an HTML element
 * @param elementId - The ID of the HTML element to convert
 * @param fileName - The name of the PDF file to download
 */
export const downloadPdfFromElement = async (elementId: string, fileName: string) => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with ID "${elementId}" not found`);
            return;
        }

        // Convert element to canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

        // Calculate dimensions
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF
        const pdf = new jsPDF({
            orientation: imgHeight > imgWidth ? "portrait" : "portrait",
            unit: "mm",
            format: "a4",
        });

        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF (handle multiple pages if needed)
        const imgData = canvas.toDataURL("image/png");
        while (heightLeft >= 0) {
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= 297; // A4 height in mm
            if (heightLeft > 0) {
                pdf.addPage();
                position = heightLeft - imgHeight;
            }
        }

        // Download PDF
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};

/**
 * Generate and download a PDF with custom content
 * @param htmlContent - HTML content to convert to PDF
 * @param fileName - The name of the PDF file to download
 */
export const downloadPdfFromHtml = async (htmlContent: string, fileName: string) => {
    try {
        // Create temporary container
        const container = document.createElement("div");
        container.innerHTML = htmlContent;
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.width = "210mm"; // A4 width
        container.style.padding = "20px";
        container.style.backgroundColor = "#ffffff";
        document.body.appendChild(container);

        // Convert to canvas
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

        // Remove temporary container
        document.body.removeChild(container);

        // Calculate dimensions
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF
        const imgData = canvas.toDataURL("image/png");
        while (heightLeft >= 0) {
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= 297;
            if (heightLeft > 0) {
                pdf.addPage();
                position = heightLeft - imgHeight;
            }
        }

        // Download PDF
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};
