import Shell from "../components/Shell";
import { requireReadyUser } from "@/lib/guard";
import { getAnswers } from "@/lib/service";
import { COMMON_QUESTIONS } from "@/lib/resume-schema";
import AnswersForm from "./AnswersForm";

// S5 Common answers (FR-05)
export default async function AnswersPage() {
  const user = await requireReadyUser();
  const answers = await getAnswers(user.id);
  return (
    <Shell active="/answers" title="Common answers">
      <p className="text-sm text-muted">Job forms ask these again and again. Answer once; we reuse them on every application.</p>
      <AnswersForm questions={COMMON_QUESTIONS} initial={answers} />
    </Shell>
  );
}
