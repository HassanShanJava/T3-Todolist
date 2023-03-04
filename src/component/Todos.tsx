import React from "react";

import { api } from "~/utils/api";
import Todo from "./Todo";

const Todos = () => {
  const {
    data: todoList,
    isLoading,
    isError,
  } = api.todo.getAllTodos.useQuery();

  if (isLoading) return <div>Loading Todos</div>;
  if (isError) return <div>Error fetchingg</div>;

  return <div className="">
    {todoList.length>0 ? todoList.map((todo)=>(
        <Todo key={todo.id} todo={todo}/>
    )):"Create your 1st Todo"}
  </div>;
};

export default Todos;
