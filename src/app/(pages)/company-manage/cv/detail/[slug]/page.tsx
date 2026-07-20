import { positionList, workingFormList } from "@/config/variable";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi tiết CV",
  description: "Mô tả trang chi tiết CV...",
};

export default async function CompanyManageCVDetailPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  const headersList = await headers(); // lấy headers từ request
  const cookie = headersList.get("cookie"); // lấy cookie từ headers

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/company/cv/detail/${slug}`,
    {
      method: "GET",
      headers: {
        cookie: cookie || "",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  let cvDetail: any = null;
  let jobDetail: any = null;
  if (data.code === "success") {
    cvDetail = data.cvDetail;
    jobDetail = data.jobDetail;
  }

  const position = positionList.find((pos) => pos.value == jobDetail.position);
  const workingForm = workingFormList.find(
    (work) => work.value == jobDetail.workingForm
  );

  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          {/* Thông tin CV */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thông tin CV
              </h2>
              <Link
                href="/company-manage/cv/list"
                className="font-[400] text-[14px] text-[#0088FF] underline"
              >
                Quay lại danh sách
              </Link>
            </div>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Họ tên:
              <span className="font-[700]">{cvDetail.fullName}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Email:
              <span className="font-[700]">{cvDetail.email}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Số điện thoại:
              <span className="font-[700]">{cvDetail.phone}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              File CV:
            </div>
            <div className="bg-[#D9D9D9] h-[736px]">
              {/* Preview File CV dạng PDF tại đây */}
              <iframe
                src={cvDetail.fileCV}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          {/* Hết Thông tin CV */}

          {/* Thông tin công việc */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black mb-[20px]">
              Thông tin công việc
            </h2>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Tên công việc:
              <span className="font-[700]">{jobDetail.title}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Mức lương:
              <span className="font-[700]">
                {Math.min(
                  jobDetail.salaryMin,
                  jobDetail.salaryMax
                ).toLocaleString()}{" "}
                -{" "}
                {Math.max(
                  jobDetail.salaryMin,
                  jobDetail.salaryMax
                ).toLocaleString()}{" "}
                $
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Cấp bậc:
              <span className="font-[700]">{position?.label}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Hình thức làm việc:
              <span className="font-[700]">{workingForm?.label}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Công nghệ:
              <span className="font-[700]">
                {jobDetail.technologies.join(", ")}
              </span>
            </div>
            <Link
              href={`/company-manage/job/edit/${jobDetail.id}`}
              target="_blank"
              className="font-[400] text-[14px] text-[#0088FF] underline"
            >
              Xem chi tiết công việc
            </Link>
          </div>
          {/* Hết Thông tin công việc */}
        </div>
      </div>
    </>
  );
}
