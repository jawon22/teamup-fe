import axios from "axios";
import { Children, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { companyState, roomState, userState } from "../recoil";
import { Badge } from "react-bootstrap";
import SockJS from "sockjs-client";

const ChatList =(props)=>{
   const  {roomNo, setRoomNo} =props;
   
    const [user, setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState);

    const [rooms , setRooms] = useRecoilState(roomState);

    const empNo = user.substring(6);

    const [empList, setEmpList] = useState([]);
    const [roomList, setRoomList] =useState([]);

    const sendData = (e) => {
      const newRoomNo = e.target.value;
      setRoomNo(newRoomNo);
    
      props.onRoomNoChange(e);
    };




    useEffect(()=>{
        console.log(empNo)
        loadempList();
    },[])
  
    const loadempList = ()=>{
  
      axios({
        url:"http://localhost:8080/emp/complexSearch/",
        method:"post",
        data:{
          comId:company,
  
        }
  
      }).then(res=>{
        console.log(res.data)
        setEmpList(res.data);
        
      });
  
    };
    const [members, setMembers] = useState([]);

    const checkMember = (e) => {
        const { value } = e.target;
    
        // 이미 선택된 멤버라면 제거, 아니면 추가
        setMembers((prevMembers) => {
          if (prevMembers.includes(value)) {
            return prevMembers.filter((member) => member !== value);
          } else {
            return [...prevMembers, value];
          }
        });
    
        console.log(members);
      };


      const loadRoomList=()=>{
        axios({
            url:`http://localhost:8080/chat/roomList/${empNo}`,
            method:'get'

        }).then(res=>{
            setRoomList(res.data);
            console.log(rooms);
            setEmpList([""]);
        });
      };


      // const enterRoom =(e)=>{
      //   setRooms(e.target.value)
      //   console.log("click",rooms)
      //   const socket = new SockJS('http://localhost:8080/ws/sockjs');
      
      //   // 연결 성공 시 실행되는 콜백
      //   socket.onopen = () => {
      //     console.log(rooms,'WebSocket Connected!');
          
      //     // 보낼 데이터를 정의
      //     const data = {
      //       type:"enterRoom",
      //       chatRoomNo: e.target.value
      //     };
          
      //     // 데이터를 JSON 문자열로 변환하여 서버로 전송
      //     socket.send(JSON.stringify(data));
      //     console.log(e.chatRoomNo)
      //   };
      
      //   // 메시지를 받았을 때 실행되는 콜백
      //   socket.onmessage = (event) => {
      //     const message = JSON.parse(event.data);
      //     console.log('Received message:', message);
      //     // 메시지 처리 로직을 추가하세요.
      //   };
      
      //   // 연결이 닫힌 경우 실행되는 콜백
      //   socket.onclose = () => {
      //     console.log(rooms,'WebSocket Connection Closed.');
      //     setRooms("")
      //   };
      
      //   // 컴포넌트가 언마운트되면 연결 종료
      //   return () => {
      //     if (socket.readyState === SockJS.OPEN) {
      //       socket.close();
      //     }
      //   };
      
      // };



       


  

return (<>
      <span><Badge bg="success"></Badge> {user}님의 채팅</span><button className="ms-3">+</button>
      {rooms}
<div className="row mt-3">
  <div className="col-5 text-center btn btn-outline-primary offset-1" onClick={loadempList} >사원리스트</div>
  <div className="col-5 text-center btn btn-outline-primary offset-1" onClick={loadRoomList}>채팅리스트</div>
</div>
<div>
{empList.map((emp, index)=>(
   <div key={emp.empNo} className="  border mt-2" style={{ borderColor: '#218C74', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'}}>
      <input type="checkbox" name="empNo" value={emp.empNo} onChange={checkMember}/>{emp.empName}
   </div>
   

))}

{roomList.map((room, index)=>(
   <div key={room.chatRoomNo} className="  border mt-2" style={{ borderColor: '#218C74', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'}}>
      <button type="button" name="chatRoomNo" value={room.chatRoomNo} onClick={sendData}>{room.chatRoomNo}</button>
   </div>
   

))}
</div>
</>);

};
export default ChatList;