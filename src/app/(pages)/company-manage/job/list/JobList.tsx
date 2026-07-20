"use client";
import { positionList, workingFormList } from "@/config/variable";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { toast, Toaster } from "sonner";

export const JobList = () => {
  const router = useRouter();
  const [jobList, setJobList] = useState<any>([]);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [countDelete, setCountDelete] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/list?page=${page}`, {
      method: "GET",
      credentials: "include", // Send with cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setJobList(data.jobs);
          setTotalPages(data.totalPages);
        }
      });
    router.replace(`?page=${page}`);
  }, [page, countDelete]);

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  const handleDelete = (id: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/delete/${id}`, {
      method: "DELETE",
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
        }
        if (data.code == "success") {
          toast.success(data.message);
          setCountDelete(countDelete + 1);
        }
      });
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {jobList.map((item: any) => {
          const position = positionList.find(
            (pos) => pos.value == item.position
          );
          const workingForm = workingFormList.find(
            (form) => form.value == item.workingForm
          );
          return (
            <div
              key={item.id}
              className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
              style={{
                background:
                  "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
              }}
            >
              <img
                src="/assets/images/card-bg.svg"
                alt=""
                className="absolute top-[0px] left-[0px] w-[100%] h-auto"
              />
              <div
                className="relative mt-[20px] w-[116px] h-[116px] bg-white mx-auto rounded-[8px] p-[10px]"
                style={{
                  boxShadow: "0px 4px 24px 0px #0000001F",
                }}
              >
                <img
                  src={item.companyLogo}
                  alt={item.title}
                  className="w-[100%] h-[100%] object-contain"
                />
              </div>
              <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
                {item.title}
              </h3>
              <div className="mt-[6px] text-center font-[400] text-[14px] text-[#121212]">
                {item.companyName}
              </div>
              <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF]">
                {Math.min(item.salaryMin, item.salaryMax).toLocaleString()} -{" "}
                {Math.max(item.salaryMin, item.salaryMax).toLocaleString()} $
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaUserTie className="text-[16px]" /> {position?.label}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaBriefcase className="text-[16px]" /> {workingForm?.label}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaLocationDot className="text-[16px]" /> {item.cityName}
              </div>
              <div className="mt-[12px] mb-[20px] mx-[16px] flex flex-wrap justify-center gap-[8px]">
                {item.technologies.map((tech: any, indexTech: any) => (
                  <div
                    key={indexTech}
                    className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]"
                  >
                    {tech}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-[12px] mb-[20px]">
                <Link
                  href={`/company-manage/job/edit/${item.id}`}
                  className="bg-[#FFB200] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                >
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-[30px] flex items-center justify-center gap-[10px]">
        {/* Nút Back */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`rounded-[8px] py-[10px] px-[18px] font-[500] text-[16px] border border-[#DEDEDE] transition-all ${
            page === 1
              ? "opacity-50 cursor-not-allowed bg-[#f2f2f2]"
              : "hover:bg-[#f8f8f8]"
          }`}
        >
          ← Trước
        </button>
        <select
          onChange={handlePagination}
          name=""
          value={page}
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
        >
          {Array(totalPages)
            .fill("")
            .map((item, index) => (
              <option key={index} value={index + 1}>
                Trang {index + 1}
              </option>
            ))}
        </select>

        {/* Nút Next */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className={`rounded-[8px] py-[10px] px-[18px] font-[500] text-[16px] border border-[#DEDEDE] transition-all ${
            page === totalPages || totalPages === 0
              ? "opacity-50 cursor-not-allowed bg-[#f2f2f2]"
              : "hover:bg-[#f8f8f8]"
          }`}
        >
          Sau →
        </button>
      </div>
    </>
  );
};
