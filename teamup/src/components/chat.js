import { Badge } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import SockJS from 'sockjs-client';
import { useEffect, useState } from "react";



const Chat = () => {
    //user로 내 정보 끌어오기
    const [user, setUser] = useRecoilState(userState);
    const [stompClient, setStompClient] = useState(null);
    
    //회사내 전체 리스트 끌어오기 
    useEffect(() => {
        // SockJS를 사용하여 WebSocket에 연결
        const socket = new SockJS('http://localhost:8080/ws');
    
        // 연결 성공 시 실행되는 콜백
        socket.onopen = () => {
          console.log('WebSocket Connected!');
        };
    
        // 메시지를 받았을 때 실행되는 콜백
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          // 메시지 처리 로직을 추가하세요.
        };
    
        // 연결이 닫힌 경우 실행되는 콜백
        socket.onclose = () => {
          console.log('WebSocket Connection Closed.');
        };
    
        // 컴포넌트가 언마운트되면 연결 종료
        return () => {
          if (socket.readyState === SockJS.OPEN) {
            socket.close();
          }
        };
      }, []); // 컴포넌트가 처음 마운트될 때만 실행
    


    return (<>

        <div className="row">
            <div className="col-4">
                <span><Badge bg="success"></Badge> {user}님의 채팅</span><button className="ms-3">+</button>
 
                <div className="row mt-3">
                    <div className="col-5 text-center btn btn-outline-primary offset-1" >사원리스트</div>
                    <div className="col-5 text-center btn btn-outline-primary offset-1" >채팅리스트</div>
                </div>
            </div>
            <div className="col-8">
                <h3>채팅방 내부</h3>
            </div>
        </div>
    </>);
};
export default Chat;