import { type AppRouter } from "../background";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>({
  overrides: {
    useMutation: {
      onSuccess: async (opts) => {
        await opts.originalFn();
        // Blindly invalidate everything on mutation. This works for our context
        // and loading data is super fast so there isn't much to worry about
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});
