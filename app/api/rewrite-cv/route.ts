export const runtime = "nodejs"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"
import selectpdf from "selectpdf"


function isValidPdfComponent(jsx: string): boolean {
  return (
    jsx.includes(`<!DOCTYPE html>`) &&
    jsx.includes(`<html lang="en">`)
  )
}

// new function using pdflayer API
async function pdfGenerate(htmlString: string) {
  if (!htmlString) {
    throw new Error("No HTML string provided!!")
  }

  if (!process.env.PDFLAYER_KEY) {
    throw new Error("PDFLAYER_KEY environment variable is not set")
  }

  try {
    // URL construction
    const url = `http://api.pdflayer.com/api/convert?access_key=${process.env.PDFLAYER_KEY}&document_name=my_rewritten_cv.pdf${process.env.NODE_ENV === 'development' && '&test=1'}`

    // Create form data for the POST request
    const formData = new URLSearchParams()
    formData.append('document_html', htmlString)
    // formData.append('page_size', 'A4')
    // formData.append('margin_top', '10')
    // formData.append('margin_bottom', '10')
    // formData.append('margin_left', '10')
    // formData.append('margin_right', '10')

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "CV-Rewriter/1.0",
      },
      body: formData.toString(),
    })


    if (!response.ok) {
      const errorText = await response.text()
      // console.error("PDFLayer API Error:", errorText)
      throw new Error(`PDFLayer API failed with status: ${response.status}`)
    }

    // Check if the response is actually a PDF
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/pdf')) {
      const responseText = await response.text()
      // console.error("PDFLayer Error Response:", responseText)
      throw new Error("Request did not return a PDF")
    }

    // Get the PDF as an ArrayBuffer
    const pdfArrayBuffer = await response.arrayBuffer()
    const pdfBuffer = Buffer.from(pdfArrayBuffer)

    console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`)
    return pdfBuffer
  } catch (error) {
    // console.error("PDF generation error:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// old function using selectpdf library
async function generatePdf(htmlString: string) {
  try {

    if (!htmlString) {
      throw new Error("No HTML string provided!!")
    }

    const client = new selectpdf.HtmlToPdfClient(process.env.SELECTPDF_LICENCE_KEY!)
    client
      .setPageSize("A4")
      .setPageOrientation("Portrait")
      .setMargins(0)
      .setRenderingEngine("WebKit")
      .setShowPageNumbers(false)
      .setPageBreaksEnhancedAlgorithm(true)
      .setUseCssPrint("True")

    // Wrap the convertHtmlString in a Promise to await the callback
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      client.convertHtmlString(htmlString, (err: any, pdf: any) => {
        if (err) return reject(err)
        resolve(pdf)
      })
    })

    // Check how many conversons are left this month
    var usageClient = new selectpdf.UsageClient(process.env.SELECTPDF_LICENCE_KEY);
    usageClient.getUsage(false, function (err2: any, data: any) {
      if (err2) return console.error("An error occurred getting the usage info: " + err2);
      console.log("Conversions remained this month: " + data["available"] + ". Usage: " + JSON.stringify(data));
    });

    return pdfBuffer
  } catch (error) {
    // console.error("PDF generation error:", error)
    throw new Error("Failed to generate PDF");
  }
}


export async function POST(request: NextRequest) {
  try {
    const { originalCV, jobRole, jobDescription, analysis } = await request.json()

    if (!originalCV || !jobRole || !analysis) {
      return NextResponse.json({ error: "Original CV, job role, and analysis are required" }, { status: 400 })
    }

    const prompt = `
      You are a CV writer, formatter and career consultant. Rewrite and structure the following CV into a HTML format.

      Create a complete HTML document with the following requirements:
      - Start with <!DOCTYPE html>
      - Include <html lang="en">, <head>, and <body> tags
      - Add proper CSS styling within <style> tags in the head
      - Make the design clean, professional, and print-friendly
      - Use proper typography and spacing
      - Group sections like Education, Experience, Skills, and Contact info clearly
      - Format content with appropriate hierarchy and bullet points
      - Ensure the layout works well for PDF conversion
      - Use web-safe fonts and avoid external dependencies

      Return ONLY the complete HTML document, no code blocks or explanations.

      Job Role: ${jobRole}
      ${jobDescription ? `Job Description: ${jobDescription}` : ""}

      Original CV:
      ${originalCV}

      Analysis Results:
      - Overall Score: ${analysis.overallScore}%
      - Strengths: ${analysis.strengths.join(", ")}
      - Weaknesses: ${analysis.weaknesses.join(", ")}
      - Missing Skills: ${analysis.missingSkills.join(", ")}
      - Missing Keywords: ${analysis.keywordMatch.missing.join(", ")}
      - Recommendations: ${analysis.recommendations.join("; ")}

      Instructions for rewriting:
      1. Maintain the factual accuracy of the original CV - do not fabricate experience or skills
      2. Reorganize and reword content to better highlight relevant experience
      3. Incorporate missing keywords naturally where they genuinely apply
      4. Strengthen weak areas identified in the analysis
      5. Emphasize the strengths mentioned in the analysis
      6. Use action verbs and quantifiable achievements where possible
      7. Tailor the language and focus to match the job role requirements
      8. Ensure the CV flows well and maintains professional formatting
      9. Keep the same general structure but optimize content presentation
      10. Add relevant skills that were missing but could reasonably be inferred from existing experience
    `

    // Generate HTML document
    const { text: cvCode } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: "You return valid, complete HTML documents that are optimized for PDF generation. Include all necessary CSS styling inline and ensure the HTML is self-contained with no external dependencies. Use semantic HTML5 elements where appropriate.",
    })

    // Clean the HTML - remove code block markers if present
    const cleanedHTML = cvCode
      .replace(/^```html|```$/g, "")      // Remove code block markers
      .replace(/^```\n?|```$/g, "")
      .trim()


    if (!isValidPdfComponent(cleanedHTML)) {
      // console.log("Cleaned HTML: ", cleanedHTML)
      return NextResponse.json({ error: "Invalid HTML structure" }, { status: 400 })
    }

    // console.log("Evaluating cleaned HTML:\n", cleanedHTML)

    // Optionally update the database with the raw HTML string
    // const session = auth()
    // if (session) {
    //   try {
    //     const userAnalyses = await getUserAnalyses(session.userId, 1)
    //     if (userAnalyses.length > 0) {
    //       await updateAnalysisWithRewrittenCV(userAnalyses[0].id, cleanedHTML)
    //     }
    //   } catch (e) {
    //     console.warn("Database update failed:", e)
    //   }
    // }

    // const pdfBuffer = await generatePdf(cleanedHTML)
    const pdfBuffer = await pdfGenerate(cleanedHTML)

    // Convert Buffer to Uint8Array for NextResponse
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfUint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rewritten_cv.pdf"',
      },
    })
  } catch (err) {
    console.error("HTML generation failed:", err)
    return NextResponse.json(
      {
        error: "Failed to generate HTML",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
