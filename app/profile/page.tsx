import Shell from "../components/Shell";
import { requireReadyUser } from "@/lib/guard";
import { getProfile } from "@/lib/service";
import ProfileForm from "./ProfileForm";
import LogoutButton from "./LogoutButton";

// S4 Check profile (FR-04)
export default async function ProfilePage() {
  const user = await requireReadyUser();
  const profile = await getProfile(user.id);
  return (
    <Shell active="/profile" title="Your profile">
      <ProfileForm initial={profile} />
      <LogoutButton />
    </Shell>
  );
}
