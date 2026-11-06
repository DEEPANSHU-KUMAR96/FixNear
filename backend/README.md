# backend

## Admin access

Public registration always creates a regular user account. To grant admin access, first register the account, then promote that user's email in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Admins can review and manage contact form submissions from `/admin`. The API endpoints are protected by both authentication and the admin role.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run server.js
```

This project was created using `bun init` in bun v1.4.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Issue photo uploads

Set `IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY` in the backend `.env` file using the credentials from your ImageKit account. Keep the private key on the server and never add it to the frontend. The backend uses the private key for authenticated uploads; issue photos are optional, limited to 5 MB, and stored as an ImageKit URL on the issue.

Send issue creation or update requests as `multipart/form-data` with the image in the `image` field. Requests without an image can continue using JSON.

## Search your issues

Use the authenticated `GET /api/issues/my` endpoint to list your issues. Add the optional `search` query parameter to search issue titles, descriptions, categories, locations, statuses, and priorities. For example:

```http
GET /api/issues/my?search=water
Authorization: Bearer <token>
```
