import React, { useState } from "react";
import { api } from "~/utils/api";
import { todoInput } from "~/types";
import { toast } from "react-hot-toast";

const CreateTodo = () => {
  const [newTodo, setNewTodo] = useState("");

  const trpc = api.useContext();

  //optimistic updates is when u dont wait for when somthing gget back from the server
  // we update the cache of the response and manully udate the server
  // we also need to rollback if server fails (not delete or update on failure to client side cache)

  const { mutate } = api.todo.createTodo.useMutation({
    onMutate: async (newTodo) => {
      // cancel any outside reftech so to prevent overiding
      await trpc.todo.getAllTodos.cancel();

      // now create snapshot to previous todos
      const previouTodo = trpc.todo.getAllTodos.getData();

      // now optimistically updae new value
      trpc.todo.getAllTodos.setData(undefined, (prev) => {
        // update function
        const optimisticTodo = {
          id: "optimistic-id",
          text: newTodo,
          done: false,
        };

        if (!prev) return [optimisticTodo];

        return [...prev, optimisticTodo];
      });

      // clear inputform
      setNewTodo("");
      return { previouTodo };
    },
    onError: (err, newTodo, context) => {
      toast.error("An error occured while creating todo");
      setNewTodo(newTodo);
      trpc.todo.getAllTodos.setData(undefined, ():any => {
        context?.previouTodo;
      });
    },
    onSettled: async () => {
      // this will reloaod the pae when new inputu
      await trpc.todo.getAllTodos.invalidate();
    },
  });

  // now to make optimistic update  for the toggle adn delete
  

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          // we validate input here
          const result = todoInput.safeParse(newTodo);
          if (!result.success) {
            // toast.error("invalid input")
            toast.error(result.error.format()._errors.join("\n"));
            return;
          }

          // here make mutation
          mutate(newTodo); // works but does not update frontend on creating, need to refetch ->look abovve on onSettled
        }}
      >
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="New Todo..."
          type="text"
          name="new-todo"
          id="new-todo"
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTodo;
