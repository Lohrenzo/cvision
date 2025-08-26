"use client"
// import * as pdfjsLib from "pdfjs-dist"
// import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import toast from "react-hot-toast"

import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

// Set worker source (required)
// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface Props {
    cvFile: File | null
    setCvFile: React.Dispatch<React.SetStateAction<File | null>>
    setCvText: React.Dispatch<React.SetStateAction<string>>
}

export default function PdfUploader({cvFile, setCvFile, setCvText}: Props) {

    /**
     * Converts a PDF file to plain text
     * @param file - A File object (from input type="file")
     * @returns Text extracted from the PDF
     */
    async function extractTextFromPDF(file: File): Promise<string> {
      try {
        const pdfjsLib = await import("pdfjs-dist")
        const { GlobalWorkerOptions, getDocument } = pdfjsLib

        // Point to your locally hosted worker
        GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await getDocument({ data: arrayBuffer }).promise
        let fullText = ""

        // Populate fullText variable with the pdf texts
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map((item: any) => item.str)
          fullText += strings.join(" ") + "\n\n"
        }

        console.log("PDF Text Extraction Success: ", fullText.trim())
        return fullText.trim()
      } catch (error) {
        console.error("PDF parsing error:", error)
        throw new Error("Failed to extract text from PDF. Please ensure the file is a valid PDF.")
      }
    }

    /**
     * Handles file upload for both PDF and text files
     * Extracts text content and updates the CV text state
     *
     * @param event - File input change event
     */
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
    
        setCvFile(file)
    
        try {
          if (file.type === "application/pdf") {
            // Handle PDF files using PDF parser
            const extractedText = await extractTextFromPDF(file)
            setCvText(extractedText)
            toast.success("CV PDF Upload Success")
          } else if (file.type === "text/plain") {
            // Handle plain text files
            const reader = new FileReader()
            reader.onload = (e) => {
              setCvText(e.target?.result as string)
            }
            reader.readAsText(file)
            toast.success("CV Text Upload Success")
          } else {
            toast.error("Please upload a PDF or TXT file.")
            // alert("Please upload a PDF or TXT file")
            setCvFile(null)
          }
        } catch (error) {
          console.error("Error processing file:", error)
          toast.error("Error processing file. Please try again.")
          // alert("Error processing file. Please try again.")
          setCvFile(null)
        }
    }
    
    return (
        <TabsContent value="upload" className="space-y-2">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-900/30">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                <p className="text-white">Upload your CV</p>
                <p className="text-sm text-gray-400">Supports PDF and TXT files</p>
                <Input
                    type="file"
                    accept=".txt,.pdf,application/pdf,text/plain"
                    onChange={handleFileUpload}
                    className="bg-gray-900/50 border-gray-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
                />
                </div>
            </div>
            {cvFile && (
                <p className="text-sm text-green-400">
                ✓ File uploaded: {cvFile.name} ({cvFile.type})
                </p>
            )}
        </TabsContent>
    )
}
