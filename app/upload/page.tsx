import { requireReadyUser } from "@/lib/guard";
import UploadForm from "./UploadForm";

// S3 Upload resume (FR-03)
export default async function UploadPage() {
  await requireReadyUser();
  return (
    <div className="mx-auto max-w-lg space-y-5 p-6">
      <div className="text-sm font-semibold tracking-wide text-brand">STEP 1 OF 3</div>
      <h1 className="text-2xl font-bold">Upload your resume</h1>
      <p className="text-muted">PDF, Word (.docx) or text. Our AI reads it and fills your profile. You can fix anything after.</p>
      <UploadForm />
    </div>
  );
}
