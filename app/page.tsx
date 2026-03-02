import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1>Digital-Arch</h1>
      <p>Website and web-app scope chatbot.</p>
      <Link href="/new-project">Start New Project</Link>
    </main>
  );
}
