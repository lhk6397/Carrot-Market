import Layout from "@components/layout";
import matter from "gray-matter";
import { readdirSync, readFileSync } from "fs";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
// getServerSideProps는 유저의 요청이 발생할 때마다 일어남.
// getStaticProps는 이 페이지가 빌드되고, nextjs가 이 페이지를 export한 후 일반 html로 될 때 딱 한 번 실행됨

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      {/* 웹사이트를 빌드할 때 md파일이 html이 되도록 할 것 */}
      {/* FAQ에 갈 때마다 데이터베이스가 매번 호출되는건 별로니까.. */}
      <h1 className="font-semibold text-center text-lg mt-5 mb-10">
        Latest Posts:{" "}
      </h1>
      {posts.map((post, idx) => (
        <div key={idx} className="mb-5">
          <Link href={`/blog/${post.slug}`}>
            <a>
              <span className="text-lg text-red-500">{post.title}</span>
              <div>
                <span>
                  {post.date} / {post.category}
                </span>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </Layout>
  );
};
// gray-matter는 files의 fonrt-matter을 parsing할 수 있도록 도와주는 parser임
export const getStaticProps: GetStaticProps = () => {
  // 사실 DB(Prisma)를 이용해서 구현할 수도 있음.
  // 따로, Blog Post 모델을 만들고, 여기서 그냥 Prisma를 호출해서 미리 만들어둔 모든 블로그 post를 제공하고, 여기에서 HTML을 생성하면 끝임.
  // 이는 build될 시에만 실행되므로 DB가 변하더라도 페이지에는 변화가 없음
  const blogPosts = readdirSync("./posts").map((file) => {
    // 이 부분이 곧 백엔드이자 CMS, CRM, Admin Panel임
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });
  return {
    props: { posts: blogPosts },
  };
};

export default Blog;
