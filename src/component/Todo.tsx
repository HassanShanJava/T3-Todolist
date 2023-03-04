import React from 'react'

const Todo = ({todo}) => {


    const {id, text,done}=todo
  return (
    <>{text}</>
  )
}

export default Todo