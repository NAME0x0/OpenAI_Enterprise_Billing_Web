import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="animate-slideUp flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: "rgba(129,140,248,0.12)", color: "var(--accent)" }}
      >
        <Search size={28} />
      </div>
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        Page not found
      </h2>
      <p className="max-w-md text-sm" style={{ color: "var(--text-muted)" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg px-4 py-2 text-sm font-medium"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
