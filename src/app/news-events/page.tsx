import { DateTime } from "luxon";
import Link from "next/link";

import { fetchBlogPosts } from "@/api";

export default async function Blog() {
  const blogPosts = await fetchBlogPosts();
  return (
    <main className="md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {blogPosts.map((blogPost) => (
          <div key={blogPost.id} className="p-4">
            <div className="aspect-square">
              <img
                className="w-full h-full object-contain"
                src={
                  blogPost.attributes.image.data?.attributes.url ??
                  "https://res.cloudinary.com/dhikr416c/image/upload/c_fill/v1739178229/logo_8c790367f0.png"
                }
              />
            </div>

            <div className="md:py-4">
              {DateTime.fromISO(blogPost.attributes.date).toLocaleString(
                DateTime.DATE_MED,
              )}
            </div>
            <div>
              <Link
                className="text-xl font-bold"
                href={`/news-events/${blogPost.attributes.slug}`}
              >
                {blogPost.attributes.title}
              </Link>
            </div>
            <div>
              <Link
                className="underline"
                href={`/news-events/${blogPost.attributes.slug}`}
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
