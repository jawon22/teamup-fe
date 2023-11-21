import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import { Badge } from "react-bootstrap";

const ChatList =()=>{
    const [user, setUser] = useRecoilState(userState);
    const [company, setCompany] = useRecoilState(companyState);

    const empNo = user.substring(6);

    const [empList, setEmpList] = useState([]);
    const [roomList, setRoomList] =useState([]);

    



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
        setRoomList([""]);

        
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
            console.log(res.data)
            setRoomList(res.data);
            setEmpList([""]);
        });

      };

  

return (<>
      <span><Badge bg="success"></Badge> {user}님의 채팅</span><button className="ms-3">+</button>

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
      <button type="checkbox" name="empNo"  >{room.chatRoomNo}</button>
   </div>
   

))}
</div>
</>);

};
export default ChatList;