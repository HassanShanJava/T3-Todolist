import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";  // to creat serverr types

import { z } from "zod"; 


type RouterOutputs=inferRouterOutputs<AppRouter>;
type allTodosOutput=RouterOutputs['todo']["getAllTodos"] //touter, and proceducre 
// trpc looks at the shape of data, then infers the types

export type Todo=allTodosOutput[number]


// has all schema type for both frfont and backen

export const todoInput = z
  .string({
    required_error: "Describe your todo",
  })
  .min(1)
  .max(70);
