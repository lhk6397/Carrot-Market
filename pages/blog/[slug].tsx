import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse/lib";
import remarkHtml from "remark-html";
import Layout from "@components/layout";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
  return (
    <Layout title={data.title} seoTitle={data.title}>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post }}
      />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  // // 동적인 URL을 갖는 페이지에서 getStaticProps를 사용할 때 필요한 함수로, 몇 개의 페이지를 만들지를 설정해주어야 하기 때문에 사용
  // const files = readdirSync("./posts").map((file) => {
  //   const [name, extension] = file.split(".");
  //   return { params: { slug: name } };
  // });
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value } = await unified() // md -> html로 바꾸기 위해서 unified, remarkParse, remarkHtml이 필요
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  return {
    props: {
      data,
      post: value,
    },
  };
};

export default Post;
