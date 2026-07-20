"use client";
import { CardJobItem } from "@/app/components/card/CardJobItem";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const JobList = (props: { item: any }) => {
  const { item } = props;
  const router = useRouter();
  const [jobList, setJobList] = useState<any>([]);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/company/detail/job/list/${item}?page=${page}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setJobList(data.jobs);
          setTotalPages(data.totalPages);
          setTotalRecords(data.totalRecord);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }, [page]);

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Việc làm */}
      <div className="mt-[30px]">
        <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">
          Công ty có {totalRecords} việc làm
        </h2>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
          {jobList.map((item: any) => (
            <CardJobItem key={item.id} item={item} />
          ))}
        </div>
      </div>
      {/* Hết Việc làm */}

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
