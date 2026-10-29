// Turn an uploaded resume file into plain text for the AI.
export async function extractText(fileName: string, bytes: Uint8Array): Promise<string> {
  const name = fileName.toLowerCase();
  if (name.endsWith(".pdf")) {
    const { extractText: pdfText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(bytes);
    const { text } = await pdfText(pdf, { mergePages: true });
    return clean(text);
  }
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
    return clean(value);
  }
  if (name.endsWith(".txt")) return clean(new TextDecoder().decode(bytes));
  throw new Error("Please upload a PDF, DOCX or TXT file");
}

function clean(s: string) {
  return s.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
