import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import client from "@libs/server/client";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}
const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>("/api/products");
  return (
    <Layout title="홈" hasTabBar seoTitle="Home">
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data
          ? data?.products?.map((product) => (
              <Item
                id={product.id}
                image={product.image}
                key={product.id}
                title={product.name}
                price={product.price}
                hearts={product._count?.favs || 0} // api 핸들러에서 불러오는 데이터에는 해당 상품에 좋아요가 몇 개인지 세어주는 _count가 있지만, getServerSideProps에서 불러오는 상품 정보에는 _count가 없고 DB에서 불러와서 아무것도 세어주지 않음. ->  0개 였다가 useSWR에 의해 반영
              />
            ))
          : "Loading..."}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      {/* fallback을 이용하여 cache의 초기값 지정 가능 */}
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  // useSWR을 이용하지 않기 때문에 static optimization이나 cache 등과 같은 기능 사용 불가능.. -> 어떻게 합칠까? -> SWRConfig를 통해 fallback 값으로 props를 전달해주면 됨
  const products = await client.product.findMany({}); // 여기에는 상품 정보는 있지만, 좋아요 count는 없음
  return {
    props: { products: JSON.parse(JSON.stringify(products)) }, // NextJS가 Prisma가 제공하는 날짜 포맷을 이해하지 못하기 때문에 JSON타입으로 변경 필요
  };
}

export default Page;

/*
1. getServerSideProps에는 상품 정보는 있지만, 좋아요 count는 없음
2. 하지만, fallback에 설정한 데에서는 문제 없이 작동
3. 하지만, Home 스크린을 클라이언트단에서 렌더링하게 되면, useSWR이 "/api/products"에 요청을 보내어, api 핸들러 함수에서 불러오는 좋아요 갯수를 더해줌.
*/
