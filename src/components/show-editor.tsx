"use client";

import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { MyShow, updateResidentShow, uploadImage } from "@/api";

import { ExternalLink } from "./external-link";

function FieldLabel({ label }: { label: string }) {
  return <label className="text-sm block">{label} </label>;
}

export function ShowEditor({ show }: { show: MyShow }) {
  const { register, handleSubmit, resetField } = useForm({
    defaultValues: show.attributes,
  });
  const [previewImageURL, setPreviewImageUrl] = useState<string>();
  const [imageToUpload, setImageToUpload] = useState<File>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit(async (data) => {
          if (imageToUpload) {
            const imageUploadFormData = new FormData();
            imageUploadFormData.append("files", imageToUpload);
            const uploadedImage = await uploadImage(imageUploadFormData).then(
              (response) => response.json(),
            );
            data.image = uploadedImage;
          } else {
            data.image = undefined;
          }

          setIsSaving(true);
          await updateResidentShow(show.attributes.id, data);
          window.location.reload();
        })}
      >
        <div className="mb-4">
          <FieldLabel label="Show name" />
          <input
            {...register("name")}
            className="p-2 w-full max-w-80 text-black"
          />
        </div>
        <div className="mb-4">
          <FieldLabel label="Show image" />
          <input
            type="file"
            {...register("image")}
            onChange={(event) => {
              const reader = new FileReader();
              reader.addEventListener(
                "load",
                () => {
                  setPreviewImageUrl(reader.result?.toString());
                },
                false,
              );
              if (event.target.files?.[0]) {
                reader.readAsDataURL(event.target.files[0]);
                setImageToUpload(event.target.files[0]);
              }
            }}
          />{" "}
          {previewImageURL ? (
            <button
              className="underline"
              type="button"
              onClick={() => {
                resetField("image");
                setPreviewImageUrl(undefined);
              }}
            >
              Clear
            </button>
          ) : null}
          {previewImageURL ? (
            <img src={previewImageURL} className="max-w-80" />
          ) : null}
        </div>
        <div className="mb-4">
          <FieldLabel label="Show description" />
          <textarea
            {...register("tagline")}
            className="p-2 w-full max-w-80 h-40 text-black"
          ></textarea>
        </div>
        <div>
          <FieldLabel label="Links" />
          <div className="mb-2">
            <FontAwesomeIcon icon={faInstagram} className="fa-fw" />{" "}
            <input {...register("instagram")} className="p-[4px] text-black" />
          </div>
          <div className="mb-2">
            <FontAwesomeIcon icon={faTwitter} className="fa-fw" />{" "}
            <input {...register("twitter")} className="p-[4px] text-black" />
          </div>
          <div className="mb-2">
            <FontAwesomeIcon icon={faFacebook} className="fa-fw" />{" "}
            <input {...register("facebook")} className="p-[4px] text-black" />
          </div>
          <div className="mb-2">
            <FontAwesomeIcon icon={faGlobe} className="fa-fw" />{" "}
            <input {...register("website")} className="p-[4px] text-black" />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="block mt-4 py-2.5 px-5 text-md rounded-sm border"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl">{show.attributes.name}</h2>
        <div className="mb-4">
          <button onClick={() => setIsEditing(true)} className="underline mr-4">
            Edit
          </button>
          <Link
            href={`/resident/${show.attributes.slug}`}
            target="_blank"
            className="underline"
          >
            Open resident page
          </Link>
        </div>
        {show.attributes.image?.formats.medium.url ? (
          <div className="mb-4">
            <img
              src={show.attributes.image.formats.medium.url}
              className="max-w-80"
            />
          </div>
        ) : null}
        <div className="mb-4">{show.attributes.tagline}</div>
        <ExternalLink type="instagram" value={show.attributes.instagram} />
        <ExternalLink type="twitter" value={show.attributes.twitter} />
        <ExternalLink type="facebook" value={show.attributes.facebook} />
        <ExternalLink type="website" value={show.attributes.website} />
      </div>
    </div>
  );
}
