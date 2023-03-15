import { z } from "zod";

import { todoInput } from "~/types";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const todoRouter = createTRPCRouter({
  // we need too belogged in to see this!!

  // ctx has prisma, and user session

  // get all todos
  getAllTodos: protectedProcedure.query(async ({ ctx, input }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });


    return todos.map(({ id, text, done }) => ({
      id,
      text,
      done,
    }))

    // return [
    //   {
    //     id: "fake",
    //     text: "fake",
    //     done: false,
    //   },
    //   {
    //     id: "fake2",
    //     text: "fake fake2",
    //     done: true,
    //   },
    //   {
    //     id: "fake3",
    //     text: "fake fake fake3",
    //     done: true,
    //   },
    // ];
  }),

  // create todo
  createTodo: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      // for  error handling
      // throw new TRPCError({code:"internalserver error"})   
      return ctx.prisma.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  // delete todo
  deleteTodo: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  // toggle todo on and off
  toggleTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done
        }
      });
    }),
});
