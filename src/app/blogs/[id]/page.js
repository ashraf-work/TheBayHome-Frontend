import Image from "next/image";
import { notFound } from "next/navigation";
import { api } from "@/services/api";

export const revalidate = 300;

async function getBlog(id) {
  try {
    const response = await api.getBlog(id);
    return response.data;
  } catch (error) {
    if (error.status === 404) notFound();
    console.error("Failed to load blog", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Blog Not Found | The Keys Vibe",
    };
  }

  return {
    title: `${blog.title} | The Keys Vibe`,
    description: blog.shortDescription,
    openGraph: {
      title: blog.title,
      description: blog.shortDescription,
      images: blog.thumbnail ? [blog.thumbnail] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl font-bold text-[var(--color-primary)] sm:text-5xl">
        {blog.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted-foreground)]">
        {blog.shortDescription}
      </p>

      {blog.thumbnail && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-[var(--color-secondary)]">
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div
        className="prose prose-neutral mt-8 max-w-none leading-relaxed text-[var(--color-foreground)]"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}
