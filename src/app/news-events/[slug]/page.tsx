import type { Metadata, ResolvingMetadata } from "next";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { fetchBlogPost } from "@/api";
import { PageContainer } from "@/components/page-container";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
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

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
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
    .process(blogPost.attributes.content_markdown);
  const contentHtml = processedContent.toString();

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-col lg:flex-row">
        <div className="md:w-1/3 md:p-4">
          <img
            className="w-full"
            src={blogPost.attributes.image.data?.attributes.url}
          />
        </div>
        <div className="p-4">
          <h1 className="text-3xl font-bold">{blogPost.attributes.title}</h1>
          <div
            className="prose prose-invert break-words"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>
    </PageContainer>
  );
}
