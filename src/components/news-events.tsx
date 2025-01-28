import { fetchBlogPosts } from "@/api";

export async function NewsEvents() {
  const blogPosts = await fetchBlogPosts();
  return (
    <div className="p-4">
      <h1 className="text-3xl md:text-5xl font-bold uppercase">
        News + Events
      </h1>
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
            <a className="text-xl font-bold">{blogPost.attributes.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
