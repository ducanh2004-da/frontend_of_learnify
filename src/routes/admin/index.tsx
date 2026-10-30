import { createFileRoute } from "@tanstack/react-router";

import RouterComponentHolder from "@/components/RouterComponentHolder";
import GraphqlError from "@/components/GraphqlError";
import TetrisLoader from "@/components/TetrisLoader";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin | Learnify" }],
  }),
  errorComponent: ({ error }) => (
    <RouterComponentHolder children={<GraphqlError error={error} />} />
  ),
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
});
