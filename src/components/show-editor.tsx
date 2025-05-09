"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { MyShow, updateResidentShow, uploadImage } from "@/api";

export function ShowEditor({ show }: { show: MyShow }) {
  const { register, handleSubmit, resetField } = useForm({
    defaultValues: show.attributes,
  });
  const [previewImageURL, setPreviewImageUrl] = useState<string>();
  const [imageToUpload, setImageToUpload] = useState<File>();
  const [isEditing, setIsEditing] = useState(false);

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

          await updateResidentShow(show.attributes.id, data);
        })}
      >
        <div className="mb-4">
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
          {previewImageURL ? <img src={previewImageURL} /> : null}
        </div>
        <div className="mb-4">
          <input {...register("name")} className="text-black" />
        </div>
        <div>
          <textarea {...register("tagline")} className="text-black"></textarea>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div>
        {show.attributes.name}{" "}
        <button onClick={() => setIsEditing(true)} className="underline">
          Edit
        </button>
        {show.attributes.image?.formats.medium.url ? (
          <img src={show.attributes.image.formats.medium.url} />
        ) : null}
      </div>
      <div>{show.attributes.tagline}</div>
    </div>
  );
}
