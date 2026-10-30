import "./index.scss";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  head: () => ({
    meta: [{ title: "User Management | Admin Portal | Learnify" }],
  }),
});
