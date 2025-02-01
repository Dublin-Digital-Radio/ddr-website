import { DateTime } from "luxon";
import Link from "next/link";

import { fetchBlogPosts } from "@/api";

export async function NewsEvents() {
  const blogPosts = await fetchBlogPosts();
  return (
    <div>
      <h1 className="text-3xl font-bold uppercase">News + Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {blogPosts.map((blogPost) => (
          <div key={blogPost.id} className="p-4">
            {
              blogPost.attributes.image.data?.attributes.url ? (
                <div className="aspect-square">
                  <img
                    className="w-full h-full object-cover"
                    src={blogPost.attributes.image.data.attributes.url}
                  />
                </div>
              ) : null // TODO: Add fallback image
            }
            <div className="md:py-4">
              {DateTime.fromISO(blogPost.attributes.date).toLocaleString(
                DateTime.DATE_MED,
              )}
            </div>
            <div>
              <Link
                className="text-xl font-bold"
                href={`/blog/${blogPost.attributes.slug}`}
              >
                {blogPost.attributes.title}
              </Link>
            </div>
            <div>
              <Link
                className="underline"
                href={`/blog/${blogPost.attributes.slug}`}
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
