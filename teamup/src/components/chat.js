import { Badge } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { companyState, roomState, userState } from "../recoil";
import SockJS from 'sockjs-client';
import { useEffect, useState } from "react";
import axios from "axios";



const Chat = (props) => {

  // const roomNo = props.roomNo;
  // //user로 내 정보 끌어오기
  // const [user, setUser] = useRecoilState(userState);
  // const [company, setCompany] = useRecoilState(companyState);

  // const [socket, setSocket] = useState();
  // const [room, setRoom] = useRecoilState(roomState);

  // //회사내 전체 리스트 끌어오기 




  // const { messages, setMessages, newMessage, setNewMessage } = props;

  // const messageChange = (e) => {
  //   let msg = e.target.value;
  //   setNewMessage(msg);
  // };

  // const sendMessage = () => {
  //   if (newMessage.trim() !== '') {
  //     props.setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     props.setNewMessage(''); // 오타 수정: propesetNewMessage -> setNewMessage
  //     props.chatMessage(newMessage);
  //   }
  // };







  // useEffect(() => {
  //   // SockJS를 사용하여 WebSocket에 연결
  //   const socket = new SockJS('http://localhost:8080/ws/sockjs');

  //   // 연결 성공 시 실행되는 콜백
  //   socket.onopen = (e) => {
  //     console.log('WebSocket Connected!');
  //     const data = {
  //       type: 'enterRoom',
  //       roomNo: room
  //     };

  //     // 보낼 데이터를 정의


  //     // 데이터를 JSON 문자열로 변환하여 서버로 전송
  //   };

  //   // 메시지를 받았을 때 실행되는 콜백
  //   socket.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     console.log('Received message:', message);
  //     // 메시지 처리 로직을 추가하세요.
  //   };

  //   // 연결이 닫힌 경우 실행되는 콜백
  //   socket.onclose = () => {
  //     console.log('WebSocket Connection Closed.');
  //   };

  //   // 컴포넌트가 언마운트되면 연결 종료
  //   return () => {
  //     if (socket.readyState === SockJS.OPEN) {
  //       socket.close();
  //     }
  //   };
  // }, []); // 컴포넌트가 처음 마운트될 때만 실행












  return (<>

    {/* <div className="col">
      <h3>채팅방 이름</h3>
      <div className="row position-static">


        <div className="">
          <div style={{ border: '1px solid #218C74', padding: '15px', minHeight: '600px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>
            {messages.map((message, index) => (
              // user의 id와 메시지의 id가 같지 않으면 렌더링
              user.id !== message.id && (
                <div key={index}>
                  <p>{message.id}: {message.content}</p>
                </div>
              )
            ))}
          </div>

          <div class="input-group mb-3 mt-3">
            <input type="text"
              value={newMessage}
              onChange={messageChange}
              placeholder="" class="form-control" aria-label="Recipient's username" aria-describedby="button-addon2" />
            <button class="btn btn-outline-primary" type="button" id="button-addon2" onClick={sendMessage}>Send</button>
          </div>


        </div>
      </div>

      <div className="row position-fixed bottom-0 end-0">
        <div className="" >

        </div>
      </div>


    </div> */}
  </>);
};
export default Chat;