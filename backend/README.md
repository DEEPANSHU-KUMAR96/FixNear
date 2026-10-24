# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.4.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Search your issues

Use the authenticated `GET /api/issues/my` endpoint to list your issues. Add the optional `search` query parameter to search issue titles, descriptions, categories, locations, statuses, and priorities. For example:

```http
GET /api/issues/my?search=water
Authorization: Bearer <token>
```
