"use client";
import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";
import { Toaster, toast } from "sonner";

// Register the plugin
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFilePoster
);

export const FormProfile = () => {
  const { infoUser } = useAuth();
  const [avatars, setAvatars] = useState<any>([]);
  useEffect(() => {
    if (infoUser) {
      if (infoUser.avatar) {
        setAvatars([
          {
            source: infoUser.avatar,
            options: {
              type: "local",
              file: {
                name: "old-avatar.jpg",
                size: 12345,
                type: "image/jpeg",
              },
              metadata: {
                poster: infoUser.avatar,
              },
            },
          },
        ]);
      }

      // Validate dữ liệu
      const validator = new JustValidate("#profileForm");

      validator
        .addField("#fullName", [
          {
            rule: "required",
            errorMessage: "Vui lòng nhập họ tên!",
          },
          {
            rule: "minLength",
            value: 5,
            errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
          },
          {
            rule: "maxLength",
            value: 50,
            errorMessage: "Họ tên không được vượt quá 50 ký tự!",
          },
        ])
        .addField("#email", [
          {
            rule: "required",
            errorMessage: "Vui lòng nhập email của bạn!",
          },
          {
            rule: "email",
            errorMessage: "Email không đúng định dạng!",
          },
        ]);
    }
  }, [infoUser]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const fullName = event.target.fullName.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const first = avatars[0];

    // Tạo FormData
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    if (first?.file && first.options?.type !== "local") {
      formData.append("avatar", first.file); // chỉ gửi ảnh mới
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: "PATCH",
      body: formData,
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
        }
        if (data.code == "success") {
          toast.success(data.message);
        }
      });
  };
  return (
    <>
      <Toaster position="top-right" richColors />
      {infoUser && (
        <form
          action=""
          id="profileForm"
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
          onSubmit={handleSubmit}
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="fullName"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Họ tên *
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoUser.fullName}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="avatar"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Avatar
            </label>
            <FilePond
              name="avatar"
              allowMultiple={false} // Chỉ chọn 1 ảnh
              allowRemove={true} // Cho phép xóa ảnh
              labelIdle="+"
              acceptedFileTypes={["image/*"]}
              onupdatefiles={setAvatars}
              files={avatars}
            />
          </div>
          <div className="">
            <label
              htmlFor="email"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Email *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoUser.email}
            />
          </div>
          <div className="">
            <label
              htmlFor="phone"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoUser.phone}
            />
          </div>
          <div className="sm:col-span-2">
            <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Cập nhật
            </button>
          </div>
        </form>
      )}
    </>
  );
};
