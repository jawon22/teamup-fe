import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { MdDone, MdDelete } from 'react-icons/md';
import { useTodoDispatch, removeTodo } from '../../TodoContext';
import { useRecoilState } from 'recoil';
import { todosState, userState } from '../../recoil';

const Remove = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dee2e6;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    color: #ff6b6b;
  }
  display: none;
`;

const TodoItemBlock = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  &:hover {/*TodoItemBlock위에 커서가 있을때, Remove컴포넌트를 보여주라는 의미*/
    ${Remove} {
      display: initial;
    }
  }
`;

const CheckCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 16px;
  border: 1px solid #78C2AD;
  background-color: #78C2AD; /* 배경색을 원하는 색상으로 설정 */
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

`;

const Text = styled.div`
  flex: 1;
  font-size: 16px;
  color: #495057;
  ${props =>
    props.done &&
    css`
      color: #ced4da;
    `}
`;

function TodoItem({ id, done, text }) {
  const [user, setUser] = useRecoilState(userState);
  const empNo = user.substring(6)
    const dispatch = useTodoDispatch();
    
      // Recoil 상태
    const [todos, setTodos] = useRecoilState(todosState);

    console.log('Done value:', done);

   const onToggle = () => {
  console.log("toggleId",id);
  dispatch({ type: 'TOGGLE', id });
   // Recoil 상태 업데이트
   setTodos(
    todos.map((todo) =>
      todo.todoNo === id ? { ...todo, todoDone: !todo.todoDone } : todo
    )
  );
};
    const onRemove = () => {
      console.log("id",id);
      removeTodo(dispatch, empNo, id);
       // Recoil 상태 업데이트
    setTodos(todos.filter((todo) => todo.todoNo !== id));
    };
      // useEffect를 TodoItem 컴포넌트 내에 추가
  useEffect(() => {
    console.log('Component re-rendered with done:', done);
  }, [done]);

  return (
    <TodoItemBlock>
      <CheckCircle done={done}>{done && <MdDone />}   
      </CheckCircle>
      <Text done={done}>{text}</Text>
      <Remove onClick={onRemove}>
        <MdDelete />
      </Remove>
    </TodoItemBlock>
  );
}

export default React.memo(TodoItem);