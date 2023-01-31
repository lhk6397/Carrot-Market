import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser(pathname?: string) {
  const { data, error } = useSWR<ProfileResponse>(
    pathname !== "/enter" && "/api/users/me"
  ); // data에는 fetcher함수가 리턴한 데이터가 저장됨
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  //   const [user, setUser] = useState();
  //   useEffect(() => {
  //     fetch("/api/users/me")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (!data.ok) {
  //           return router.replace("/enter");
  //         }
  //         setUser(data.profile);
  //       });
  //   }, [router]);

  return { user: data?.profile, isLoading: !data && !error };
}
