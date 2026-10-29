import Shell from "../components/Shell";
import { requireReadyUser } from "@/lib/guard";
import TailorForm from "./TailorForm";

// Paste a job -> tailored resume + cover note (FR-10, FR-22)
export default async function TailorPage() {
  await requireReadyUser();
  return (
    <Shell active="/tailor" title="Tailor to a job">
      <p className="text-sm text-muted">Paste any job you like. We rewrite your resume for it using only what is true in your profile.</p>
      <TailorForm />
    </Shell>
  );
}
