import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import Image from "next/image";
import { useRouter } from "next/router";
interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}
interface EditProfileResponse {
  ok: boolean;
  error?: string;
}
const EditProfile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.avatar) setAvatarPreview(user?.avatar);
  }, [user, setValue]);

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", {
        message: "Email OR Phone number are required. You need to choose one.",
      });
    }
    if (avatar && avatar.length > 0 && user) {
      const form = new FormData();
      form.append("file", avatar[0], user?.id + "");
      form.append("upload_preset", "ehedqmvh");
      const { url } = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`,
        {
          method: "POST",
          body: form,
        }
      ).then((data) => data.json());
      editProfile({
        email,
        phone,
        name,
        avatarUrl: url,
      });
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
    router.push("/");
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file)); // 브라우저의 메모리에 있는 파일의 url
    }
  }, [avatar]);

  return (
    <Layout canGoBack title="Edit Profile" seoTitle="Edit Profile">
      <form className="py-10 px-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              width={48}
              height={48}
              alt="avatar"
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formErrors && (
          <span className="my-2 text-red-500 font-medium block text-center">
            {errors.formErrors.message}
          </span>
        )}
        <Button loading={loading} text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
