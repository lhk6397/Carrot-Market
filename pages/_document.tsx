import Document, { Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default CustomDocument;

// _app component는 유저가 페이지를 불러올 때마다 브라우저에서 실행
// _document component는 서버에서 한번만 실핻됨 -> html의 뼈대를 짜기 위해 주로 사용하며 위의 코드들은 필수로 들어가야되는 내용들임
// 무조건 구굴 폰트를 써야함 <- NextJS의 폰트 최적화는 구글 폰트에서 제공하는 폰트를 기반으로 하기 때문
