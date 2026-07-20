"use client";
import { CardJobItem } from "@/app/components/card/CardJobItem";
import { positionList, workingFormList } from "@/config/variable";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const skill = searchParams.get("skill") || "";
  const city = searchParams.get("city") || "";
  const company = searchParams.get("company") || "";
  const keyword = searchParams.get("keyword") || "";
  const position = searchParams.get("position") || "";
  const workingForm = searchParams.get("workingForm") || "";
  const [jobList, setJobList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/search?skill=${skill}&city=${city}&company=${company}&keyword=${keyword}&position=${position}&workingForm=${workingForm}&page=${page}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setJobList(data.jobs);
          setTotalPages(data.totalPages);
          setTotalRecord(data.totalRecord);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }, [skill, city, company, keyword, position, workingForm, page]);

  const handleFilterPosition = (event: any) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("position", value);
    } else {
      params.delete("position");
    }
    router.push(`?${params.toString()}`);
  };

  const handleFilterWorkingForm = (event: any) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("workingForm", value);
    } else {
      params.delete("workingForm");
    }
    router.push(`?${params.toString()}`);
  };

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
      <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
        {totalRecord} việc làm{" "}
        <span className="text-[#0088FF]">
          {skill} {city} {company} {keyword}
        </span>
      </h2>

      <div
        className="bg-white rounded-[8px] py-[10px] px-[20px] mb-[30px] flex flex-wrap gap-[12px]"
        style={{
          boxShadow: "0px 4px 20px 0px #0000000F",
        }}
      >
        <select
          name=""
          onChange={handleFilterPosition}
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
          defaultValue={position}
        >
          <option value="">Cấp bậc</option>
          {positionList.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          name=""
          onChange={handleFilterWorkingForm}
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
          defaultValue={workingForm}
        >
          <option value="">Hình thức làm việc</option>
          {workingFormList.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {jobList.map((item) => (
          <CardJobItem key={item.id} item={item} />
        ))}
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
