import React from 'react';
import styled from 'styled-components';
import TodoItem from './TodoItem';
import { useTodoState } from '../../TodoContext';
import { todosState } from '../../recoil';
import { useRecoilValue } from 'recoil';

const TodoListBlock = styled.div`
  flex: 1;
  padding: 10px 22px;
  padding-bottom: 48px;
  overflow-y: auto;
`;

function TodoList() {
  // Recoil 상태 사용
  const todos = useRecoilValue(todosState);

  return (
            <TodoListBlock>
                {todos.map(todo => (
                    <TodoItem
                        key={todo.todoNo}
                        id={todo.todoNo}
                        text={todo.todoContent}
                        done={todo.todoDone}
                    />
                ))}
            </TodoListBlock>
            );
}

export default React.memo(TodoList);