import React from 'react';
import styled from 'styled-components';
import { useTodoState } from '../../TodoContext';


const TodoHeadBlock = styled.div`
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
  .todoHeadDate {
    margin: 0;
    color: #343a40;
  }
  .todoDay {
    margin-top: 4px;
    color: #868e96;
    font-size: 17px;
  }
  .tasks-left {
    color: #218C74;
    font-size: 15px;
    margin-top: 15px;
    font-weight: bold;
  }
`;

function TodoHead() {
    const todos = useTodoState();
    console.log(todos);
    const undoneTasks = todos.filter(todo => !todo.done);

    const today = new Date();
    const dateString = today.toLocaleDateString('ko-kr', {
        year : 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dayName = today.toLocaleDateString('ko-kr', {weekday: 'long'});

  return (
    <TodoHeadBlock>
      <h5 className='todoHeadDate'>{dateString}</h5>
      <div className="todoDay">{dayName}</div>
      <div className="tasks-left">할 일 {undoneTasks.length}개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;