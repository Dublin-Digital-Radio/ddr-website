import { fetchBlogPosts } from "@/api";

export async function NewsEvents() {
  const blogPosts = await fetchBlogPosts();
  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-bold uppercase">
        News + Events
      </h1>
      {blogPosts.map((blogPost) => (
        <div key={blogPost.id}>{blogPost.attributes.title}</div>
      ))}
    </div>
  );
}
