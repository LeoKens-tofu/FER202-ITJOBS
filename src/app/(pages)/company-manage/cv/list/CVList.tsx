"use client";
import { cvStatusList, positionList, workingFormList } from "@/config/variable";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCircleCheck,
  FaEnvelope,
  FaEye,
  FaPhone,
  FaUserTie,
} from "react-icons/fa6";
import { toast, Toaster } from "sonner";

export const CVList = () => {
  const router = useRouter();
  const [cvList, setCVList] = useState<any>([]);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [countUpdate, setCountUpdate] = useState(0);
  const [countDelete, setCountDelete] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/list?page=${page}`, {
      method: "GET",
      credentials: "include", // Send with cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setCVList(data.cvList);
          setTotalPages(data.totalPages);
        }
      });
    router.replace(`?page=${page}`);
  }, [page, countUpdate, countDelete]);

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  const handleDelete = (id: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/delete/${id}`, {
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

  const handleChangeStatus = (id: string, status: string) => {
    const dataFinal = {
      status: status,
    };

    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/change-status/${id}`, {
      method: "PATCH",
      credentials: "include", // Gửi kèm cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
        }

        if (data.code == "success") {
          toast.success(data.message);
          setCountUpdate(countUpdate + 1);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {cvList.map((item: any) => {
          const position = positionList.find(
            (pos) => pos.value == item.position
          );
          const workingForm = workingFormList.find(
            (work) => work.value == item.workingForm
          );
          const status = cvStatusList.find((st) => st.value == item.status);

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
              <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
                {item.title}
              </h3>
              <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
                Ứng viên: <span className="font-[700]">{item.fullName}</span>
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaEnvelope className="" /> {item.email}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaPhone className="" /> {item.phone}
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
              <div
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                style={{
                  color: `${item.viewed ? "#121212" : "#FF0000"}`,
                }}
              >
                <FaEye className="text-[16px]" />{" "}
                {item.viewed ? "Đã xem" : "Chưa xem"}
              </div>
              <div
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                style={{
                  color: status?.color,
                }}
              >
                <FaCircleCheck className="text-[16px]" /> {status?.label}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
                <Link
                  href={`/company-manage/cv/detail/${item.id}`}
                  className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                >
                  Xem
                </Link>
                {item.status != "approved" && (
                  <button
                    className="bg-[#9FDB7C] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]"
                    onClick={() => handleChangeStatus(item.id, "approved")}
                  >
                    Duyệt
                  </button>
                )}
                {item.status != "rejected" && (
                  <button
                    onClick={() => handleChangeStatus(item.id, "rejected")}
                    className="bg-[#FF5100] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                  >
                    Từ chối
                  </button>
                )}
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
