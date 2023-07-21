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
    "username": "abc",
    "password": "xxx"
  },
  {
    "username": "xyz",
    "password": "345"
  }
]
```

```shell
deno run -A main.ts

# or compile to a binary
deno compile -A main.ts
```
