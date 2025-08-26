
/**
 * PDF Text Extraction Utility
 *
 * This module provides functionality to extract text content from PDF files
 * using the pdf-parse library for client-side PDF processing.
 */


// /**
//  * Converts a PDF file to plain text
//  * @param file - A File object (from input type="file")
//  * @returns Text extracted from the PDF
//  */
// export async function extractTextFromPDF(file: File): Promise<string> {
//   try {
//     const arrayBuffer = await file.arrayBuffer()
//     const pdf = await getDocument({ data: arrayBuffer }).promise
//     let fullText = ""

//     // Populate tullText variable with the pdf texts
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i)
//       const content = await page.getTextContent()
//       const strings = content.items.map((item: any) => item.str)
//       fullText += strings.join(" ") + "\n\n"
//     }

//     console.log("PDF Text Extraction Success: ", fullText.trim())
//     return fullText.trim()
//   } catch (error) {
//     console.error("PDF parsing error:", error)
//     throw new Error("Failed to extract text from PDF. Please ensure the file is a valid PDF.")
//   }
// }

// /**
//  * Extracts text content from a PDF file
//  *
//  * @param file - The PDF file to extract text from
//  * @returns Promise<string> - The extracted text content
//  * @throws Error if PDF parsing fails
//  */
// export async function extractTextFromPDF(file: File): Promise<string> {
//   try {
//     // Import pdf-parse dynamically to avoid SSR issues
//     const pdfParse = (await import("pdf-parse")).default

//     // Convert file to array buffer
//     const arrayBuffer = await file.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)

//     // Parse PDF and extract text
//     const data = await pdfParse(buffer)

//     // Return cleaned text content
//     return data.text.trim()
//   } catch (error) {
//     console.error("PDF parsing error:", error)
//     throw new Error("Failed to extract text from PDF. Please ensure the file is a valid PDF.")
//   }
// }
// app/utils/pdf-parser.ts

// export async function extractTextFromPDF(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append('file', file);

//   const response = await fetch('/api/parse-pdf', {
//     method: 'POST',
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error('Failed to extract text from PDF');
//   }

//   const data = await response.json();
//   return data.text.trim();
// }


// /**
//  * Validates if a file is a supported format
//  *
//  * @param file - The file to validate
//  * @returns boolean - True if file format is supported
//  */
// export function isSupportedFileType(file: File): boolean {
//   const supportedTypes = ["application/pdf", "text/plain"]

//   return supportedTypes.includes(file.type)
// }

// /**
//  * Gets human-readable file type description
//  *
//  * @param file - The file to get description for
//  * @returns string - Human-readable file type
//  */
// export function getFileTypeDescription(file: File): string {
//   switch (file.type) {
//     case "application/pdf":
//       return "PDF Document"
//     case "text/plain":
//       return "Text File"
//     default:
//       return "Unknown Format"
//   }
// }
