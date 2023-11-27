import React, { useReducer, createContext, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { todosState, userState } from './recoil';


const initialTodos = [];//초기 Todo 정보는 비어있는 배열로 설정

function todoReducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.todo);
    case 'TOGGLE':
      return state.map(todo =>
        todo.todoNo === action.id ? { ...todo, todoDone: !todo.todoDone } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.todoNo !== action.id);
    case 'SET_TODOS':
      return action.todos; // SET_TODOS에 대한 처리 추가

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();
const TodoNextIdContext = createContext();

export function TodoProvider({ children }) {
  const [user, setUser] = useRecoilState(userState);
  const [todos, setTodos] = useRecoilState(todosState); // Recoil 상태 가져오기
  const empNo = user.substring(6)
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);

  // Todo 불러오기
  useEffect(() => {
    const fetchTodos = () => {
      axios
        .get(`${process.env.REACT_APP_REST_API_URL}/todo/list/${empNo}`) // API endpoint에 맞게 수정
        .then((response) => {
          dispatch({ type: 'SET_TODOS', todos: response.data });
          setTodos(response.data); // Recoil 상태 업데이트
        })
        .catch((error) => {
        });
    };

    fetchTodos();
  }, [empNo, setTodos]);


  
    return (
      <TodoStateContext.Provider value={state}>
        <TodoDispatchContext.Provider value={dispatch}>
          <TodoNextIdContext.Provider value={nextId}>
            {children}
          </TodoNextIdContext.Provider>
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    );
  }

  export function useTodoState() {
    const context = useContext(TodoStateContext);
    if (!context) {
      throw new Error('Cannot find TodoProvider');
    }
    return context;
  }
  
  export function useTodoDispatch() {
    const context = useContext(TodoDispatchContext);
    if (!context) {
      throw new Error('Cannot find TodoProvider');
    }
    return context;
  }
  
  export function useTodoNextId() {
    const context = useContext(TodoNextIdContext);
    if (!context) {
      throw new Error('Cannot find TodoProvider');
    }
    return context;
  }
// TodoContext.js

export function createTodo(dispatch, nextId, empNo, text) {
  axios
    .post(`${process.env.REACT_APP_REST_API_URL}/todo/save`, {
      todoContent: text,
      todoDone: false,
      todoNo: nextId,
      empNo: empNo, 
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const newTodo = response.data;
      dispatch({ type: 'CREATE', todo: newTodo });
    })
    .catch((error) => {
    });
}

  
  export function removeTodo(dispatch, empNo,  id) {
    axios
      .delete(`${process.env.REACT_APP_REST_API_URL}/todo/${id}`)
      .then(() => {
        console.log(id);
        dispatch({ type: 'REMOVE', empNo, id });
      })
      .catch((error) => {
      });
  }