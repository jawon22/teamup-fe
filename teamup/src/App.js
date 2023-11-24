import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import "./components/Sidebar";
import "./components/styles.css";
import ApproveList from "./components/ApproveList";
import ApproveWrite from "./components/ApproveWrite";
import Com from './components/com';
import Search from './components/search';
import Home from './components/home';
import Login from './components/login';
import Mypage from './components/mypage';
import DeptInsert from './components/detpInsert';
import CompanyJoin from './components/companyJoin';
import Board from './components/Board';
import TeamUpLogo from './components/images/TeamUpLogo.png';

import { BsFillBellFill } from "react-icons/bs";
import { RiKakaoTalkFill } from "react-icons/ri";

import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SalList from './components/SalList';
import Offcanvas from 'react-bootstrap/Offcanvas';
// import ProfileEdit from './components/profileEdit';//마이페이지로 합치면 지울껍니당
import Calendar from './components/calendar';
import DeptCalendar from './components/deptCalendar';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { companyState, roomState, userState } from './recoil';
import Emp from './components/Emp';
import surf from "./components/images/profileImage.png";
import Chat from './components/chat';

import BoardDetail from './components/BoardDetail';

import ChatList from './components/chatList';
import SockJS from 'sockjs-client';
import BoardUpdate from './components/BoardUpdate';
import MainBoard from './components/MainBoard';












function App() {
  const location = useLocation();
  const [user, setUser] = useRecoilState(userState);
  const savedToken = Cookies.get('userId');

  // 조직도 관련 const 모음--------------------
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  //------------------------------조직도 끝---


//user로 내 정보 끌어오기



// const [socket, setSocket] = useState();
// const [room , setRoom] = useRecoilState(roomState);

// const [roomNo, setRoomNo] = useState("");



// const onRoomNoChange = () => {
//   //채팅방 번호 전달하기

//   console.log(roomNo);

//   console.log('useEffect in App.js triggered!');
// };




// useEffect((props) => {
//   // SockJS를 사용하여 WebSocket에 연결
//   const socket = new SockJS('http://localhost:8080/ws/sockjs');

//   // 연결 성공 시 실행되는 콜백
//   socket.onopen = () => {
//     console.log('WebSocket Connected!');
//     const data = {
//       type: 'enterRoom',
//       chatRoomNo: roomNo
//     };
    
//     // 보낼 데이터를 정의

    
//     // 데이터를 JSON 문자열로 변환하여 서버로 전송
//   };

//   console.log('App.js의 useEffect가 트리거되었습니다!');

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


















  const [company, setCompany] = useRecoilState(companyState);
  const navigate = useNavigate();

  const loadInfo = () => {

    console.log("????", savedToken)
    axios({
      url: `http://localhost:8080/emp/findtoken/${savedToken}`,
      method: 'get',
    }).then(res => {

      if (savedToken && savedToken === res.data.token) {
        const decode = jwtDecode(savedToken)
        const userId = decode.sub
        setUser(userId);
        console.log(userId)
        let userNo = userId.substring(6);


        axios({
          url: `http://localhost:8080/emp/mypage/${userNo}`,
          method: 'get'
        }).then(response => {
          console.log(response.data)
          setCompany(response.data.comId)


        });
      }
    }
    )
  }


  const sessionId = sessionStorage.getItem("comId");

  useEffect(() => {
    setCompany(sessionId)
    console.log("세션아이디::",sessionId)
  }, [])


  useEffect(() => {
    loadInfo();
}, [company, user]);


useEffect(()=>{
  if(user===''){
    navigate("/login");
  }

},[])





  //axios로 사용자 정보를 찾아서 이사람이 관리자인지 여부에따라 보여주고 말고를 결정하고 
  //만약에  user가 null이 아니면 로그인 버튼 활성화 로그인이 되어있다면 비활성화


  const [showModal, setShowModal] = useState(false);


  //로그인한 회원의 상단 프로필이미지
  const loggedInEmpNo = parseInt(user.substring(6));

  const [imgSrc, setImgSrc] = useState(null);//처음에는 없다고 치고 기본이미지로 설정
  useEffect(()=>{

      axios({
        url:`http://localhost:8080/image/profile/${loggedInEmpNo}`,
        method:"get"
      })
      .then(response=>{
        setImgSrc(`http://localhost:8080/image/profile/${loggedInEmpNo}`);
      })
      .catch(err=>{
        setImgSrc(surf);
      });
  },[user]);


  //이미지가 있으면 imgSrc를 사용하고, 없다면 surf를 사용
  const displayImage = imgSrc || surf;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);



  return (
    <>
    
    <Routes>
      <Route path="/login" element={<Login style={{ margin: 0 }} />} />
    </Routes>
    
      <div className='main-content container-fluid'>
        

        {user ===''? '': <Sidebar />}

        {/* <div className='row ms-15 mt-3'> */}
        <div className='row ms-15'>
          <div className='col-md-10 offset-md-1'>


            {/* 헤더 */}

            {user ===''?'':(



            <div className='row'>
              <div className='col-4 app-start'>
                <Navbar.Brand href="#home" className='logo'>
                  <img src={TeamUpLogo} alt="TemaUpLog" width={100} />
                  <NavLink to="/companyJoin" className="ms-5">회사로그인</NavLink>

                  <NavLink to="/deptInsert" className="ms-1">부서등록</NavLink>
                  {/* <NavLink to="/empTree" className={"ms-2"}>조직도</NavLink> */}
                  {/* <NavLink to="/profileEdit" className="ms-1">프로필</NavLink> */}

                  <Button onClick={handleShow} className=" btn btn-primary ms-3">조직도</Button>

                </Navbar.Brand>
              </div>

              <div className='col-4 app-center'>아오</div>

              <div className='col-4 app-end'>

                <div className='row'>
                  <div className='col text-end'>
               
                    <div className='col-2'>
                      <Navbar expand="sm" className="bg-body-white ">
                        <Nav className="bg-body-primary ">




                          <NavDropdown title={<img src={displayImage} alt="profileImage" className="rounded-circle" 
                                  style={{width:"45px", height:"45px", objectFit:"cover"}}/>} id="basic-nav-dropdown">  
                            {/* <NavDropdown title={<CgProfile className="me-3" size={45}style={{color:'#218C74'}} />} id="basic-nav-dropdown">  */}
                            {/* <img src={imgSrc} alt="profileImage" className="rounded-circle" 
                                  style={{width:"45px", height:"45px", objectFit:"cover"}}/> */}
                            <NavDropdown.Item href="#mypage"  >마이페이지</NavDropdown.Item>

                            <NavDropdown.Item href="#action/3.2">로그아웃</NavDropdown.Item>
                          </NavDropdown>
                        </Nav>
                      </Navbar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
            {/* 본문 */}
            {/* 여기가 회원 로그인 페이지 ===> 회원이 로그인을 하면 select 로 찾아서  sessionstoregy 에 저장 하고 */}


            {/* 회사 로그인 */}













            {/* <div className='mt-3'> */}
            <div>
              <Routes>
                {/* 각종 라우터 */}
                <Route path="/approveList" element={<ApproveList />}></Route>
                <Route path="/approveWrite" element={<ApproveWrite />}></Route>
                <Route path='/com' element={<Com />} ></Route>
                <Route path='/search' element={<Search user={user} />}></Route>
                <Route path='/home' element={<Home  user={user}/>}></Route>
                <Route path="/mypage" element={<Mypage user={user} />}></Route>
                <Route path="/deptInsert" element={<DeptInsert />}></Route>
                <Route path="/calendar" element={<Calendar />}></Route>
                <Route path='/companyJoin' element={<CompanyJoin />}></Route>
                <Route path='/salList' element={<SalList />}></Route>
                <Route path="/deptCalendar" element={<DeptCalendar />} ></Route>
                <Route path="/Board" element={<Board />} ></Route>
                <Route path='/empTree' element={<Emp />} />
                <Route path='/board/find/:idx' element={<BoardDetail />} />
                <Route path='/board/update/:idx' element={<BoardUpdate />} />
                <Route path='/mainBoard' element={<MainBoard />} />



                {/* 마이페이지에 합치면 profileEdit는 지울껍니당 */}
                {/* <Route path="/profileEdit" element={<ProfileEdit />}></Route> */}


              </Routes>
            </div>

            {/* 조직도  */}
            <div className='row'>

              <div className='col-10 offset-1'>
                <Offcanvas show={show} onHide={handleClose} placement='end'>
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>조직도</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Emp />
                  </Offcanvas.Body>
                </Offcanvas>

              </div>
            </div>

          </div>
        </div>

      </div>



{/* 
      {showModal && (
        <div className="chat-modal-background" >
          <div className="chat-modal-content">
            <button className="chat-modal-close-button" onClick={closeModal}>
              &times;
            </button>

            <div className='chat-container'>
              <div className='row'>
                <div className='col-4' >
                  <ChatList setRoomNo={setRoomNo}   list={roomNo}  onRoomNoChange={onRoomNoChange}/>
                </div>
                <div className='col-8'>
                  <Chat/>
                </div>
              </div>
            </div>




            <button className="position-absolute bottom-0 end-0 me-3 mb-3" onClick={closeModal}>닫기</button>
          </div>
          <div>
          </div>
        </div>
      )} */}

    </>
  );
}

export default App;