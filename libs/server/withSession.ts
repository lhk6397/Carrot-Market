import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  // withApiSession: 쿠키를 가져와서 암호화를 푼 다음 request 안에 그 쿠키 내용들을 넣어주는 것.
  // -> iron session에게 req 오브젝트를 제공해서, iron session은 쿠키를 가져오고 해독한 다음, 그 쿠키의 결과를 req?.session.user 내부에 넣어줌.
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler: any) {
  // withIronSessionSsr: 얘가 있으면 이제 getServerSideProps 안에서 인증 기능 사용 가능
  return withIronSessionSsr(handler, cookieOptions);
}
