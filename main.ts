import "https://deno.land/std/dotenv/load.ts";
import { Buffer } from "node:buffer";

const users = JSON.parse(Deno.readTextFileSync("./accounts.json"));

const clientId = Deno.env.get("CLIENT_ID");
const clientSecret = Deno.env.get("CLIENT_SECRET");

async function fetchAccessToken(username, password, clientId, clientSecret) {
  const response = await fetch(
    `https://www.reddit.com/api/v1/access_token?grant_type=password&username=${username}&password=${password}`,
    {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
        "authorization": `Basic ${
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
        }`,
      },
    },
  );

  const data = await response.json();

  if (!data.access_token) {
    console.log(data.error);
    return;
  }

  return data.access_token;
}

async function getPixel(x, y, accessToken, canvas) {
   const response = await fetch("https://gql-realtime-2.reddit.com/query", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "origin": "https://garlic-bread.reddit.com",
      "referer": "https://garlic-bread.reddit.com/",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
      "apollographql-client-name": "garlic-bread",
      "apollographql-client-version": "0.0.1",
      "authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      "operationName": "pixelHistory",
      "query": "mutation pixelHistory($input: ActInput!) {\n  act(input: $input) {\n    data {\n      ... on BasicMessage {\n        id\n        data {\n          ... on GetTileHistoryResponseMessageData {\n            lastModifiedTimestamp\n            userInfo {\n              userID\n              username\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
      "variables": {
        "input": {
          "PixelMessageData": {
            "coordinate": { "x": x, "y": y },
            "colorIndex": 0,
            "canvasIndex": canvas,
          },
          "actionName": "r/replace:get_tile_history",
        },
      },
    }),
  });

  return await response.json();

}

async function placePixel(x, y, color, canvas, accessToken) {
  const response = await fetch("https://gql-realtime-2.reddit.com/query", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "origin": "https://garlic-bread.reddit.com",
      "referer": "https://garlic-bread.reddit.com/",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
      "apollographql-client-name": "garlic-bread",
      "apollographql-client-version": "0.0.1",
      "authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      "operationName": "setPixel",
      "query": "mutation setPixel($input: ActInput!) {\n  act(input: $input) {\n    data {\n      ... on BasicMessage {\n        id\n        data {\n          ... on GetUserCooldownResponseMessageData {\n            nextAvailablePixelTimestamp\n            __typename\n          }\n          ... on SetPixelResponseMessageData {\n            timestamp\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
      "variables": {
        "input": {
          "PixelMessageData": {
            "coordinate": { "x": x, "y": y },
            "colorIndex": color,
            "canvasIndex": canvas,
          },
          "actionName": "r/replace:set_pixel",
        },
      },
    }),
  });

  return await response.json();
}

async function place(username, password) {
  const accessToken = await fetchAccessToken(
    username,
    password,
    clientId,
    clientSecret,
  );

  console.log(accessToken);
  if (!accessToken) return;

  const data = await placePixel(502, 0, 13, 4, accessToken);

  {
    const { data } = await getPixel(502, 0, accessToken, 4);
    console.log(data.act.data);
  }

  if (data.errors) {
    return data.errors;
  } else {
    return data.data.act.data;
  }
}

for (const { username, password } of users) {
  console.log(await place(username, password));
}
