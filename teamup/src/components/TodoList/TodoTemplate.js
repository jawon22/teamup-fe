import React from 'react';
import styled from 'styled-components'; 


const TodoTemplateBlock = styled.div`
width: 400px;
height: 400px;

position: relative; /* 추후 박스 하단에 추가 버튼을 위치시키기 위한 설정 */
background: white;
border-radius: 16px;
box-shadow: 0 0 4px 0 rgba(33, 140, 116);

margin: 0 auto; /* 페이지 중앙에 나타나도록 설정 */

display: flex;
flex-direction: column; /*컨테이너 내의 자식요소들을 세로축(column)을 따라 배치*/
`;

function TodoTemplate({children}){
    return <TodoTemplateBlock>{children}</TodoTemplateBlock>;
}
export default TodoTemplate;