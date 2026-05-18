import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Tag } from "lucide-react";
import { api } from "@/services/api";

export const revalidate = 300;

export const metadata = {
  title: "Florida Keys Travel Blog | The Keys Vibe",
  description:
    "Travel notes, local tips, and stay-planning ideas for Florida Keys vacation guests.",
};

async function getBlogs() {
  try {
    const response = await api.listBlogs({ status: "published" });
    return response.data || [];
  } catch (error) {
    console.error("Failed to load blogs", error);
    return [];
  }
}

function formatDate(date) {
  if (!date) return "Coming soon";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function BlogsPage() {
  const blogs = await getBlogs();
  console.log(blogs)

  return (
    <div>
      <section className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Florida Keys Blog
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            Local notes for better stays, easier planning, and more time on the water.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        {blogs.length === 0 ? (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-secondary)] px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-semibold">Posts are coming soon</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--color-muted-foreground)]">
              The blog page is ready and will publish new articles as soon as they are added from the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm"
              >
                <Link href={`/blogs/${blog._id}`} className="block">
                  <div className="relative aspect-[4/3] bg-[var(--color-secondary)]">
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </span>
                      {blog.tags?.[0] && (
                        <span className="inline-flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {blog.tags[0]}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-xl font-semibold text-[var(--color-foreground)]">
                      {blog.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                      {blog.shortDescription}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
