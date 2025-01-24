import { fetchBlogPosts } from "@/api";

export async function NewsEvents() {
  const blogPosts = await fetchBlogPosts();
  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-bold uppercase">
        News + Events
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {blogPosts.map((blogPost) => (
          <div key={blogPost.id}>
            {blogPost.attributes.image.data?.attributes.url ? (
              <img
                width={400}
                src={blogPost.attributes.image.data.attributes.url}
              />
            ) : null}
            <a className="text-xl font-bold">{blogPost.attributes.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
