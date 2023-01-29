import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const alreadyExists = await client.fav.findFirst({
    // findUnique는 unique 속성에만 사용 가능 (ex. id 속성)
    where: {
      productId: +id.toString(),
      userId: user?.id,
    },
  });

  if (alreadyExists) {
    await client.fav.delete({
      // delete는 unique 속성에 대해서만 삭제 가능
      // unique가 아닌 속성에 대한 삭제를 하는 경우 -> deleteMany 이용
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
