import React from 'react';
import styled from 'styled-components';
import { useTodoState } from '../../TodoContext';
import { RiTodoLine } from "react-icons/ri";

const TodoHeadBlock = styled.div`
  padding-top: 20px;

  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
  .todoHeadDate {
    text-align : center;
    margin: 0;
    color: #218C74;
    font-weight: bold;
  }
  .tasks-left {
    text-align : right;
    color: #218C74;
    font-size: 15px;
    margin-top: 15px;
  }
`;

function TodoHead() {
    const todos = useTodoState();
    console.log(todos);
    const undoneTasks = todos.filter(todo => !todo.todoDone);

    const today = new Date();
    const dateString = today.toLocaleDateString('ko-kr', {
        year : 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dayName = today.toLocaleDateString('ko-kr', {weekday: 'long'});

  return (
    <TodoHeadBlock>
      <h3 className='todoHeadDate'><RiTodoLine /> TodoList <RiTodoLine /></h3>
      <div className="tasks-left">할 일 {undoneTasks.length}개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;