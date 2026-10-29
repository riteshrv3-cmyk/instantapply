import Link from "next/link";

const TABS = [
  { href: "/resume", label: "Resume" },
  { href: "/tailor", label: "Tailor" },
  { href: "/answers", label: "Answers" },
  { href: "/profile", label: "Profile" },
];

// Logged-in frame: top bar + bottom tabs (design section 1; Jobs/Queue/Tracker/Inbox come in later slices).
export default function Shell({ active, title, children }: { active: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-white/90 px-4 py-3 backdrop-blur">
        <div className="text-xs font-semibold tracking-wide text-brand">INSTANT APPLY</div>
        <h1 className="text-lg font-bold">{title}</h1>
      </header>
      <main className="flex-1 space-y-4 p-4 pb-24">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-white">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`py-3 text-center text-sm font-medium ${active === t.href ? "text-brand" : "text-muted"}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
