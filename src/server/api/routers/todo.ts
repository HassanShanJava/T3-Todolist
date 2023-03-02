import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  // we need too belogged in to see this!!

  // ctx has prisma, and user session
  getAllTodos: protectedProcedure.query(async ({ ctx, input }) => {
    
    // const todos = await ctx.prisma.todo.findMany({
    //   where: {
    //     userId: ctx.session.user.id,
    //   },
    // });

    // return todos.map(({ id, text, done }) => ({
    //   id,
    //   text,
    //   done,
    // }));

    return [
      {
        id: "fake",
        text: "fake",
        done: false,
      },
      {
        id: "fake2",
        text: "fake fake2",
        done: true,
      },
      {
        id: "fake3",
        text: "fake fake fake3",
        done: true,
      },
    ];
  }),
});
