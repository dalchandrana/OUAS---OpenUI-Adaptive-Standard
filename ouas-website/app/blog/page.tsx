import { NavBar } from "@/components/ui/NavBar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const POSTS = [
  {
    slug: "introducing-ouas",
    title: "Introducing OUAS: The OpenUI Adaptive Standard",
    description: "Why we built a deterministic specification for AI-driven user interfaces, and how it differs from LLM UI generation.",
    category: "Spec Updates",
    date: "Oct 24, 2026",
    badge: "new" as const
  },
  {
    slug: "how-validator-works",
    title: "How the OUAS Validator Pipeline Works",
    description: "A deep dive into the 7-step validation process that ensures AI agents can never break your application layout.",
    category: "Engineering",
    date: "Oct 20, 2026"
  },
  {
    slug: "building-mailflow",
    title: "Building MailFlow: An Adaptive Email Client",
    description: "Case study on adapting a traditional inbox into a task list and calendar view using a single OUAS manifest.",
    category: "Case Studies",
    date: "Oct 15, 2026"
  }
];

export default function BlogIndex() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <NavBar />

      <main className="flex-1 container mx-auto px-4 py-16 md:px-6">
        <div className="mb-16">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">From the OUAS team</h1>
          <p className="mt-4 max-w-[600px] text-lg text-text-secondary">
            Engineering deep dives, specification updates, and case studies on building adaptive interfaces.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", "Engineering", "Spec Updates", "Case Studies", "Community"].map(cat => (
            <button key={cat} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${cat === 'All' ? 'bg-text-primary text-bg-base' : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface/80'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post (First one) */}
        <Link href={`/blog/${POSTS[0].slug}`} className="block mb-12">
          <div className="rounded-2xl border border-border-color bg-surface p-8 transition-all hover:border-border-bright hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="new">New</Badge>
              <span className="text-sm text-text-secondary">{POSTS[0].date}</span>
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">{POSTS[0].title}</h2>
            <p className="text-text-secondary text-lg">{POSTS[0].description}</p>
          </div>
        </Link>

        {/* Post Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.slice(1).map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-primary">{post.category}</span>
                    <span className="text-xs text-text-secondary">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl mb-2 leading-snug">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
