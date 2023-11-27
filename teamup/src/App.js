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
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsWechat } from "react-icons/bs";

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
import './components/img.css'
import { LuFolderTree } from "react-icons/lu";
import MainBoard from './components/MainBoard';
import { invalid } from 'moment';












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



  const [socket, setSocket] = useState();
  const [room, setRoom] = useRecoilState(roomState);

  const [roomNo, setRoomNo] = useState("");



  const onRoomNoChange = () => {
    //채팅방 번호 전달하기

    const data = {
      type: 'enterRoom',
      empNo:user,
      chatRoomNo: `${roomNo}`,
    };

    // 디버깅을 위해 데이터를 콘솔에 로그
    // console.log('전송?', data);

    // 데이터를 JSON 문자열로 변환하여 WebSocket을 통해 전송
    webSock.send(JSON.stringify(data));

    // console.log(roomNo);

    // console.log('useEffect in App.js triggered!');
  };


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [webSock, setWebSock] =useState();



  useEffect(() => {
    const socket = new SockJS(`${process.env.REACT_APP_REST_API_URL}/ws/sockjs`);
    setWebSock(socket);
  
    socket.onopen = () => {
      // console.log('WebSocket Connected!');
      const data = {
        type: 'enterRoom',
        chatRoomNo: 'waitingRoom',
        empNo: user,
        empName: empName,
      };
      socket.send(JSON.stringify(data));
      // console.log(data, '입장');
      // 세션에 속성 설정
      socket.sessionAttributes = {
        empNo: `${user}`,
        empName: empName,
      };
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      // 새로운 메시지를 기존 메시지 목록에 추가
    };
  
    socket.onclose = () => {
      // console.log('WebSocket Connection Closed.');
    };
  
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const chatMessage = (message) => {
    // WebSocket 연결이 열려 있는지 확인
    if (webSock && webSock.readyState === WebSocket.OPEN) {
      // 'message' 타입의 데이터 객체를 생성하고 주어진 메시지를 추가
      const data = {
        type: 'message',
        id:user,
        content: message,
        chatRoomNo:roomNo,
      };
  
      // 디버깅을 위해 데이터를 콘솔에 로그
      // console.log('전송?', data);
  
      // 데이터를 JSON 문자열로 변환하여 WebSocket을 통해 전송
      webSock.send(JSON.stringify(data));
    } else {
      // WebSocket 연결이 열려 있지 않은 경우 오류 메시지를 로그
      // console.error('WebSocket connection is not open.');
    }
  };










  const [company, setCompany] = useRecoilState(companyState);
  const navigate = useNavigate();

  const loadInfo = () => {

    console.log("????", savedToken)
    axios({
      url: `${process.env.REACT_APP_REST_API_URL}/emp/findtoken/${savedToken}`,
      method: 'get',
    }).then(res => {

      if (savedToken && savedToken === res.data.token) {
        const decode = jwtDecode(savedToken)
        const userId = decode.sub
        setUser(userId);
        let userNo = userId.substring(6);


        axios({
          url: `${process.env.REACT_APP_REST_API_URL}/emp/mypage/${userNo}`,
          method: 'get'
        }).then(response => {
          setCompany(response.data.comId)
        });
      }
    }
    )
  }


  const sessionId = sessionStorage.getItem("comId");

  useEffect(() => {
    setCompany(sessionId)
  }, [])


  useEffect(() => {
    loadInfo();
  }, [company, user]);


  const [lastVisitedPage, setLastVisitedPage] = useState(null);

  useEffect(() => {
    // 페이지 이동 시마다 현재 경로를 저장
    setLastVisitedPage(location.pathname);
  }, [location.pathname]);


  useEffect(() => {
    if (sessionId) {
      navigate("/deptInsert")

    }
    else if (savedToken === undefined) {
      navigate("/login")
    }
    else {
      navigate(setLastVisitedPage)
    }
  }, [savedToken, sessionId])





  //axios로 사용자 정보를 찾아서 이사람이 관리자인지 여부에따라 보여주고 말고를 결정하고 
  //만약에  user가 null이 아니면 로그인 버튼 활성화 로그인이 되어있다면 비활성화


  const [showModal, setShowModal] = useState(false);


  //로그인한 회원의 상단 프로필이미지
  const loggedInEmpNo = parseInt(user.substring(6));

  const [imgSrc, setImgSrc] = useState(null);//처음에는 없다고 치고 기본이미지로 설정
  useEffect(() => {

    axios({
      url: `${process.env.REACT_APP_REST_API_URL}/image/profile/${loggedInEmpNo}`,
      method: "get"
    })
      .then(response => {
        setImgSrc(`${process.env.REACT_APP_REST_API_URL}/image/profile/${loggedInEmpNo}`);
      })
      .catch(err => {
        setImgSrc(surf);
      });
  }, [user]);


  //이미지가 있으면 imgSrc를 사용하고, 없다면 surf를 사용
  const displayImage = imgSrc || surf;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);




  const empName = sessionStorage.getItem("userName")
  return (
    <>
    
    <Routes>
      <Route path="/login" element={<Login style={{ margin: 0 }} />} />
    </Routes>
    
      <div className='main-content container-fluid'>
        

        {user === ''  ? '' : <Sidebar />}
      

        {/* {sessionId ? (
          // sessionId가 존재하는 경우
          <Sidebar />
        ) : savedToken === undefined ? (
          // savedToken이 정의되지 않은 경우
          ''
        ) : (
          // 모든 조건이 충족되지 않는 경우
          <Sidebar />
        )}    */}
        
        <div className='row ms-10 mt-3'>
          <div className='col-md-10 offset-md-1'>

            {/* Header */}
            {user === '' ? '' : (
              <div className='row'>
                <div className='col-8 app-start'>
                  <Navbar.Brand href="#home" className='logo'>
                    <img src={TeamUpLogo} alt="TeamUpLogo" width={100} />
                  </Navbar.Brand>
                </div>

                {/* <div className='col-4 app-start'>
                  <Navbar.Brand href="#home" className='logo'>
                    <img src={TeamUpLogo} alt="TeamUpLogo" width={100} />
                  </Navbar.Brand>
                </div> */}

                <div className='col-4 app-end' style={{ display: 'flex', flexDirection: 'row' }}>
                  <div className='row'>
                    <div className='col-3'></div>
                      <div className='col-3 align-self-center'>
                        <BsWechat onClick={openModal} className='me-2 text-green header-icon'
                            style={{width: "40px", height: "40px"}}/>
                      </div>
                      <div className='col-3 align-self-center'>
                          <HiMiniUserGroup onClick={handleShow} className='me-2 text-green header-icon '
                              style={{width: "45px", height: "45px"}}/>
                      </div>
                      <div className='col-3 text-end'>
                      <Navbar expand="sm" className="bg-body-white">
                        <Nav className="bg-body-primary ">
                          <NavDropdown title={<img src={displayImage} alt="profileImage" className="rounded-circle header-icon"
                            style={{ width: "45px", height: "45px", objectFit: "cover"}} />} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#mypage">마이페이지</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">로그아웃</NavDropdown.Item>
                          </NavDropdown>

                          {/* <div className='col'>
                            {user}<br />{empName} <label className='form-label'>님 환영합니다!</label>
                          </div> */}

                        </Nav>
                      </Navbar>
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
                <Route path='/home' element={<Home user={user} />}></Route>

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




      {showModal && (
        <div className="chat-modal-background" >
          <div className="chat-modal-content">
            <button className="chat-modal-close-button" onClick={closeModal}>
              &times;
            </button>

            <div className='chat-container'>
              <div className='row'>
                <div className='col-4' >
                  <ChatList setRoomNo={setRoomNo} list={roomNo} onRoomNoChange={onRoomNoChange} />
                </div>
                <div className='col-8'>
                  <Chat
                    messages={messages}
                    setMessages={setMessages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    chatMessage={chatMessage} // chatMessage 함수를 전달
                  />
                </div>
              </div>
            </div>




            <button className="position-absolute bottom-0 end-0 me-3 mb-3" onClick={closeModal}>닫기</button>
          </div>
          <div>
          </div>
        </div>
      )}

    </>
  );
}

export default App;