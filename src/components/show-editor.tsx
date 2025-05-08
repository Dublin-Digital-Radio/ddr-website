"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { MyShow, updateResidentShow } from "@/api";

export function ShowEditor({ show }: { show: MyShow }) {
  const { register, handleSubmit } = useForm({
    defaultValues: show.attributes,
  });
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <form
        className="text-black"
        onSubmit={handleSubmit(async (data) => {
          await updateResidentShow(show.attributes.id, data);
        })}
      >
        <div className="mb-4">
          <input {...register("name")} />
        </div>
        <div>
          <textarea {...register("tagline")}></textarea>
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
      </div>
      <div>{show.attributes.tagline}</div>
    </div>
  );
}
