import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Resume } from "./resume-schema";

// ATS-friendly resume: one column, real text (no images or tables), standard headings.
export async function renderResumePdf(r: Resume): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595, H = 842, M = 48, maxW = W - 2 * M;
  let page: PDFPage = doc.addPage([W, H]);
  let y = H - M;

  const ensure = (h: number) => {
    if (y - h < M) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };
  const line = (text: string, f: PDFFont, size: number, indent = 0) => {
    for (const part of wrap(ascii(text), f, size, maxW - indent)) {
      ensure(size + 4);
      page.drawText(part, { x: M + indent, y: y - size, size, font: f, color: rgb(0, 0, 0) });
      y -= size + 4;
    }
  };
  const heading = (t: string) => {
    y -= 6;
    line(t.toUpperCase(), bold, 11);
    ensure(4);
    page.drawLine({ start: { x: M, y: y + 1 }, end: { x: W - M, y: y + 1 }, thickness: 0.5 });
    y -= 4;
  };
  const bullet = (t: string) => line(`- ${t}`, font, 10, 8);

  line(r.name || "Your Name", bold, 18);
  line([r.email, r.phone, r.location].filter(Boolean).join("  |  "), font, 10);
  if (r.links.length) line(r.links.join("  |  "), font, 10);

  if (r.summary) { heading("Summary"); line(r.summary, font, 10); }
  if (r.education.length) {
    heading("Education");
    for (const e of r.education) {
      line(`${e.degree}, ${e.college}`, bold, 10);
      line([e.cgpa && `CGPA ${e.cgpa}`, e.grad_year && `Graduation ${e.grad_year}`].filter(Boolean).join("  |  "), font, 10);
    }
  }
  if (r.skills.length) { heading("Skills"); line(r.skills.join(", "), font, 10); }
  if (r.projects.length) {
    heading("Projects");
    for (const p of r.projects) {
      line(p.github ? `${p.title}  (${p.github})` : p.title, bold, 10);
      p.points.forEach(bullet);
    }
  }
  if (r.experience.length) {
    heading("Experience");
    for (const x of r.experience) {
      line(`${x.role}, ${x.company}${x.dates ? `  (${x.dates})` : ""}`, bold, 10);
      x.points.forEach(bullet);
    }
  }
  if (r.certifications.length) { heading("Certifications"); r.certifications.forEach(bullet); }

  return doc.save();
}

// Standard PDF fonts only cover basic Latin; replace anything else so rendering never fails.
function ascii(s: string) {
  return s
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-").replace(/•/g, "-").replace(/₹/g, "Rs ")
    .replace(/[^\x20-\x7E]/g, "");
}

function wrap(text: string, f: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = cur ? `${cur} ${word}` : word;
    if (f.widthOfTextAtSize(next, size) > width && cur) {
      out.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) out.push(cur);
  return out.length ? out : [""];
}
