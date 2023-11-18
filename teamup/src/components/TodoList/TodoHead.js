import React from 'react';
import styled from 'styled-components';

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
  return (
    <TodoHeadBlock>
      <h5 className='todoHeadDate'>2023년 11월 10일</h5>
      <div className="todoDay">수요일</div>
      <div className="tasks-left">할 일 2개 남음</div>
    </TodoHeadBlock>
  );
}

export default TodoHead;