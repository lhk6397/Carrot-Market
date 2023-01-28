import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type HTTPMethod = "GET" | "POST" | "DELETE";

export default function withHandler(method: HTTPMethod, fn: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).end();
    }
    try {
      await fn(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
}
