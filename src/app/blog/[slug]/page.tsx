import type { Metadata, ResolvingMetadata } from "next";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { fetchBlogPost } from "@/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const blogPost = await fetchBlogPost({ slug: (await params).slug });

  if (!blogPost) {
    return {
      title: resolvedParent.title?.absolute,
      description: resolvedParent.description,
    };
  }

  return {
    title: `${blogPost.attributes.title} | ${resolvedParent.title?.absolute}`,
    openGraph: {
      images: blogPost.attributes.image.data?.attributes.url
        ? [blogPost.attributes.image.data.attributes.url]
        : [],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const blogPost = await fetchBlogPost({ slug: params.slug });
  if (!blogPost) {
    return null;
  }

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(blogPost.attributes.content);
  const contentHtml = processedContent.toString();

  return (
    <main className="flex flex-col md:flex-col lg:flex-row">
      <div>
        <img
          className="w-full"
          src={blogPost.attributes.image.data?.attributes.url}
        />
      </div>
      <div className="p-4">
        <h1 className="text-3xl font-bold">{blogPost.attributes.title}</h1>
        <div
          className="prose break-words"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </main>
  );
}
