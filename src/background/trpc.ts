import { initTRPC } from "@trpc/server";
import { type State } from "./state";
import { ZodError } from "zod";

interface Context {
  state: State;
}

const t = initTRPC.context<Context>().create({
  isServer: false,
  allowOutsideOfServer: true,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodIssues:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.issues
            : undefined,
      },
    };
  },
});

export const middleware = t.middleware;

const logMiddleware = middleware(async (opts) => {
  const start = Date.now();

  const res = await opts.next();

  console.debug("TRPC request:", {
    type: opts.type,
    path: opts.path,
    input: opts.input,
    ok: res.ok,
    durationMs: Date.now() - start,
  });

  return res;
});

export const router = t.router;
export const publicProcedure = t.procedure.use(logMiddleware);
