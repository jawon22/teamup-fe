import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { useTodoDispatch, useTodoNextId, createTodo } from '../../TodoContext';
import { useRecoilState } from 'recoil';
import { todosState, userState } from '../../recoil';


const CircleButton = styled.button`
  background: #2EC2A1;
  &:hover {
    background: #2EC2A1;
  }
  &:active {
    background: #2EC2A1;
  }

  z-index: 5;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: block;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translate(-50%, 50%);
  color: white;
  border-radius: 50%;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.125s all ease-in;
  ${props =>
    props.open &&
    css`
      background: #ff7675;
      &:hover {
        background: #ff7675;
      }
      &:active {
        background:#ff7675;
      }
      transform: translate(-50%, 50%) rotate(45deg);
    `}
`;

const InsertFormPositioner = styled.div`
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
`;

const InsertForm = styled.form`
  background: #f8f9fa;
  padding-left: 22px;
  padding-top: 22px;
  padding-right: 22px;
  padding-bottom: 30px;

  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #e9ecef;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  width: 100%;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
`;

function TodoCreate() {
  const [user, setUser] = useRecoilState(userState);
  const empNo = user.substring(6)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
  
      // Recoil 상태 및 디스패치
    const [todos, setTodos] = useRecoilState(todosState);
    const dispatch = useTodoDispatch();
    const nextId = useTodoNextId();
  
    const onToggle = () => setOpen(!open);
    const onChange = e => setValue(e.target.value);
    const onSubmit = (e) => {
      e.preventDefault();
    // 로컬 상태 대신 Recoil 상태 업데이트
    createTodo(dispatch, nextId.current, empNo, value);
    setTodos([...todos, { todoNo: nextId.current, todoContent: value, todoDone: false }]);
    setValue('');
    setOpen(false);
      
    };
    
  
    return (
      <>
        {open && (
          <InsertFormPositioner>
            <InsertForm onSubmit={onSubmit}>
              <Input
                autoFocus
                placeholder="입력 후, Enter 를 누르세요"
                onChange={onChange}
                value={value}
              />
            </InsertForm>
          </InsertFormPositioner>
        )}
        <CircleButton onClick={onToggle} open={open}>
          <MdAdd />
        </CircleButton>
      </>
    );
  }
  
  export default React.memo(TodoCreate);