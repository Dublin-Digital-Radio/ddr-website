import type { Metadata, ResolvingMetadata } from "next";

import { fetchShowInfo } from "@/api";
import { ExternalLink } from "@/components/external-link";
import { PageContainer } from "@/components/page-container";
import { getCloudinaryOptimizedImageUrl } from "@/utils";

import { Playlist } from "./playlist";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParent = await parent;
  const resident = await fetchShowInfo({ slug: (await params).slug });

  if (!resident) {
    return {
      title: resolvedParent.title?.absolute,
      description: resolvedParent.description,
    };
  }

  return {
    title: `${resident.name} | ${resolvedParent.title?.absolute}`,
    openGraph: {
      images: resident.image.data?.attributes.url
        ? [
            getCloudinaryOptimizedImageUrl(resident.image.data.attributes.url, {
              width: 800,
              height: 800,
            }),
          ]
        : [],
    },
  };
}

export default async function Resident(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const resident = await fetchShowInfo({ slug: params.slug });
  if (!resident) {
    return null;
  }

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-col lg:flex-row">
        <div className="lg:w-1/3">
          {resident.image.data?.attributes.url ? (
            <img
              className="w-full"
              src={getCloudinaryOptimizedImageUrl(
                resident.image.data.attributes.url,
                {
                  width: 800,
                  height: 800,
                },
              )}
            />
          ) : null}
        </div>
        <div className="p-4 lg:w-1/3">
          <h1 className="text-3xl font-bold">{resident.name}</h1>
          {resident.tagline ? <p className="pb-4">{resident.tagline}</p> : null}
          <ExternalLink type="instagram" value={resident.instagram} />
          <ExternalLink type="twitter" value={resident.twitter} />
          <ExternalLink type="facebook" value={resident.facebook} />
          <ExternalLink type="website" value={resident.website} />
        </div>
        <div className="p-4 lg:w-1/3">
          <Playlist showName={resident.name} />
        </div>
      </div>
    </PageContainer>
  );
}
