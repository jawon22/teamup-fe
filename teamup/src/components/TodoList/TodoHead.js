import React from 'react';
import styled from 'styled-components';
import { useTodoState } from '../../TodoContext';
import { RiTodoLine } from "react-icons/ri";
import { todosState } from '../../recoil';
import { useRecoilState } from 'recoil';

const TodoHeadBlock = styled.div`
  padding-top: 15px;

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
    // Recoil 상태 및 디스패치
    const [todos, setTodos] = useRecoilState(todosState);
    console.log(todos);
    const undoneTasks = todos.filter(todo => !todo.todoDone);
    



  return (
    <TodoHeadBlock>
      <h3 className='todoHeadDate'><RiTodoLine /> TodoList <RiTodoLine /></h3>
      <div className="tasks-left">할 일 {undoneTasks.length}개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;