import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import Twitter from "twitter-v2";

type ResponseData = {
  data: any;
  message: string;
};

type RawData = {
  data: Record<string, any>[];
  includes: {
    users: ObjectUser[];
  };
  meta: Record<string, any>;
};

type ObjectUser = {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
};

type Params = {
  expansions: string;
  "tweet.fields": string;
  "user.fields": string;
  "media.fields": string;
  pagination_token?: string;
};
export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const token: null | Record<string, any> = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const userID = token?.userProfile.userID;

  const client = new Twitter({
    bearer_token: token?.credentials.authToken,
  });

  let out: RawData = {
    data: [],
    includes: { users: [] },
    meta: { next_token: "token" },
  };

  const mapUser: Record<string, ObjectUser> = {};

  try {
    let i = 0;
    do {
      i++;
      if (i > 5) {
        break;
      }

      let params: Params = {
        expansions: "author_id,attachments.media_keys",
        "tweet.fields": "text,created_at,entities,attachments",
        "user.fields": "username,profile_image_url",
        "media.fields": "url",
      };

      if (i > 1 && out.meta.next_token) {
        params.pagination_token = out.meta.next_token;
      }

      const response: any = await client.get(
        `users/${userID}/bookmarks`,
        params
      );

      out.data = [...out.data, ...response.data];
      out.includes.users = [
        ...out.includes.users,
        ...(response.includes?.users ?? []),
      ];
      out.meta = response.meta == null ? null : response.meta;
    } while (out.meta.next_token);

    // insert map user
    (out.includes.users || []).forEach((data: ObjectUser) => {
      if (mapUser[data.id] == undefined) {
        mapUser[data.id] = data;
      }
    });

    // merge user data in twitter list
    const newList = out.data.map((list) => {
      const dataUser = mapUser[list["author_id"]];
      if (!!dataUser) {
        return {
          ...list,
          author_username: dataUser.username,
          author_name: dataUser.name,
          author_profile_image: dataUser.profile_image_url,
        };
      } else {
        return list;
      }
    });

    out.data = newList;

    return res.status(200).json({
      data: out,
      message: "success",
    });
  } catch (error) {
    return res.status(500).send({ message: "Unknown Error", data: null });
  }
};
