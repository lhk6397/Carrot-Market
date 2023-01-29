import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";

export default function useUser() {
  const { data, error } = useSWR("/api/users/me"); // data에는 fetcher함수가 리턴한 데이터가 저장됨
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
