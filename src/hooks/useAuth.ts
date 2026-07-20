import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [infoCompany, setInfoCompany] = useState<any>(null);
  const pathname = usePathname(); 
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-token`, {
      method: "GET",
      credentials: "include", 
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 'error') {
          setIsLogin(false);
        }
        if (data.code == 'success') {
          setIsLogin(true);
          if (data.userInfo) {
            setInfoUser(data.userInfo);
            setInfoCompany(null);
          }
          if (data.companyInfo) {
            setInfoCompany(data.companyInfo);
            setInfoUser(null);
          }
        }
      });
  }, [pathname]);

  return { isLogin, infoUser , infoCompany };

}
