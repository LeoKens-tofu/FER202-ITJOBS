"use client";
import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const CompanyList = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setCompanyList(data.companies);
          setTotalPages(data.totalPages);
        }
      });
  }, [page]);

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  return (
    <>
      {/* Wrap */}
      <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
        {/* Item */}
        {companyList.map((item) => (
          <CardCompanyItem key={item.id} {...item} />
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
