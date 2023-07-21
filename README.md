## r/IndiaPlace place pixel

Setup `.env` with:

```env
CLIENT_ID=xxx
CLIENT_SECRET=xxx
```

Setup `accounts.json`:

```json
[
  {
    "accessToken": "..."
  },
  {
    "accessToken": "..."
  }
]
```

```shell
deno run -A main.ts

# or compile to a binary
deno compile -A main.ts
```

### Grabbing the accessToken from r/place

Watch this video to extract the access token from the reddit website:

https://user-images.githubusercontent.com/35738060/161390213-d7f8354c-a97d-4a0f-9442-f33ba84941ba.mp4

Video credits: PlaceCZ/Bot fuho#7423
