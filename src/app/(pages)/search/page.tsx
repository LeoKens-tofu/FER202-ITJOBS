import { Metadata } from "next"
import { SearchContainer } from "./SearchContainer"

export const metadata: Metadata = {
  title: "Kết quả tìm kiếm",
  description: "Kết quả tìm kiếm công việc...",
}

export default function SearchPage() {
  return (
    <>
      {/* Kết quả tìm kiếm */}
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          
          <SearchContainer/>

        </div>
      </div>
      {/* Hết Kết quả tìm kiếm */}
    </>
  )
}