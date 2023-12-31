import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
// import { NavLink } from "react-router-dom";
import axios, { isCancel } from "axios";
import { deptNoState, nameState, userState } from "../recoil";
// import { CgProfile } from "react-icons/cg";//임시프로필사진
import Calendar from "./calendar";
import surf from "./images/profileImage.png";

import './homeStyle.css';
import TodoTemplate from "./TodoList/TodoTemplate";
import TodoHead from "./TodoList/TodoHead";
import TodoList from "./TodoList/TodoList";
import TodoCreate from "./TodoList/TodoCreate";
import { TodoProvider } from "../TodoContext";
import Weather from "./weather";
import MainBoard from "./MainBoard";
import MainApprove from "./MainApprove";
import DeptCalendar from "./deptCalendar";

const Home = (props) => {

  const [user, setUser] = useRecoilState(userState);



  //강사님이 알려주신 거
  // const [empNo, setEmpNo] = useState('');

  //등록을 위한 state
  const [attendList, setAttendList] = useState({});

  //상태판정
  const [flag, setFlag] = useState("출근전");


  const [name, setName] = useRecoilState(nameState);
  //const [positionName ,setPositionName] =useRecoilState();
  const [deptNo, setDeptNo] = useRecoilState(deptNoState);

  //사원 
  const [empInfo, setEmpInfo] = useState({
    comId: '',
    deptNo: '',
    deptName: '',
    empId: '',
    empName: '',
    empEmail: '',
    empPositionNo: '',
    empTel: '',
    empJoin: ''
  });




  //출퇴근 버튼 활성화&비활성화
  useEffect(() => {
    if (attendList.attendStart && attendList.attendEnd) {
      setFlag("근무완료");
    }
    else if (attendList.attendStart) {
      setFlag("근무중");
    }
    else {
      setFlag("근무전");
    }
  }, [attendList]);

  //강사님이 알려주신 거
  // useEffect(() => {
  //   setEmpNo(user.substring(6));
  // }, [user]);
  const empNo = user.substring(6);

  //페이지가 로드 될 때마다 attend 객체 조회
  useEffect(() => {
    loadAttend();
  }, [props.user]);

  //조회 (오늘 출퇴근버튼 누른 시간)
  const loadAttend = () => {

    axios({
      url: `${process.env.REACT_APP_REST_API_URL}/attend/findTodayAttendByEmpNo/${empNo}`,
      method: "post",
    })
      .then((response) => {
        setAttendList(response.data);
      })
      .catch((err) => {
      });
  };

  //출근 버튼(등록)
  const attendStartClick = () => {

    axios({
      url: `${process.env.REACT_APP_REST_API_URL}/attend/${empNo}`,
      method: 'post',
      data: { empNo: empNo }
    })
      .then(response => {
        setAttendList(response.data);
      })
      .catch(err => {
      });
  };

  //퇴근 버튼(수정)
  const attendEndClick = () => {
    axios({
      url: `${process.env.REACT_APP_REST_API_URL}/attend/${empNo}`,
      method: "patch"
    })
      .then(response => {
        setAttendList(response.data);
      });
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };


    return new Date(dateTimeString).toLocaleString("ko-KR", options);

  };


  //사원번호로 프로필 이미지 불러오기
  const loggedInEmpNo = parseInt(user.substring(6));

  const [imgSrc, setImgSrc] = useState(surf);//처음에는 없다고 치고 기본이미지로 설정
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
  }, [props.user]);


  //이미지가 있으면 imgSrc를 사용하고, 없다면 surf를 사용
  const displayImage = imgSrc || surf;


  // 이름과 직급을 찍기 위해 사원정보를 불러옴
  const myInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/emp/mypage/${empNo}`);
      setEmpInfo(response.data);

      setName(response.data.empName);
      setDeptNo(response.data.deptNo);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  //
  const [profile, setProfile] = useState({
    deptName: '',
    empPositionName: '',
  });

  //프로필 조회
  const loadProfile = (loggedInEmpNo) => {
    axios({
      url: `${process.env.REACT_APP_REST_API_URL}/profile/${loggedInEmpNo}`,
      method: "get",
    })
      .then(response => {//성공
        // console.log(response);
        setProfile(response.data);
      });
  };

  useEffect(() => {
    loadProfile(loggedInEmpNo);
  }, [props.user]);

  useEffect(() => {
    myInfo();
  }, [props.user]);



  const [isSchedule, setIsSchedule] = useState(false);

  const toggleCal = () => {
    if (isSchedule === false) {
      setIsSchedule(true);
    }
    else if (isSchedule === true) {
      setIsSchedule(false);
    }

  };

  return (

    <div className="row mt-2 mp space">
      {/* <div className="row mt-2 mp space"> */}

      {/* 세로로 첫 번째 줄 */}
      <div className="home-profile col-3">

        <div className="h-50 pb-3">

          {/* 프로필과 출퇴근 버튼 */}
          <div className="row p-3 me-1 d-flex graybox 
                                    justify-content-center align-items-center h-100">
            {/* <CgProfile  size={150}style={{color:'#218C74'}} /> */}


            {/* 프로필 */}
            <img src={displayImage} alt="profileImage" id="previewImage" className="rounded-circle"
              style={{ width: "220px", height: "200px", objectFit: "cover" }} />

            <div className="d-flex item-center text-bold">
              <div className="approve-dept rounded-start">{profile.deptName}</div>
              <div className="approve-position rounded-end">{profile.empPositionName}</div>

              <div className="ms-2">{empInfo.empName}</div>
            </div>

            {/* 출근 */}
            <div className="d-flex ms-4">
              <div className="m-1 me-3 font-mian-title">출근시간</div>
              <div className="m-1 font-main-content">{attendList.attendStart ? formatDateTime(attendList.attendStart) : "-"}</div>
              <button className="ms-2 btn btn-primary custom-btn font-mian-btn" onClick={attendStartClick}
                disabled={flag !== "근무전"}>출근</button>
            </div>

            {/* 퇴근 */}
            <div className="d-flex ms-4">
              <div className="ms-1 me-3 font-mian-title">퇴근시간</div>
              <div className="ms-1 font-main-content">{attendList.attendEnd ? formatDateTime(attendList.attendEnd) : "-"}</div>
              <button className="ms-2 btn btn-primary custom-btn font-mian-btn" onClick={attendEndClick}
                disabled={flag === "근무전"}>퇴근</button>
            </div>

          </div>
        </div>

        {/* 투두리스트 */}
        <div className="h-50">
          <div className="row home-todo me-1 h-100">
            <TodoProvider>
              <TodoTemplate style={{ width: '100%', height: '100%' }}>
                <TodoHead />
                <TodoList />
                <TodoCreate />
              </TodoTemplate>
            </TodoProvider>
          </div>

        </div>
      </div>

      {/* 세로로 두 번째 줄 */}
      <div className="col-5 home-center">

        <div className="h-50 pb-3">
          <div className="row graybox border-primary h-100">
            <MainBoard user={user}/>
          </div>
        </div>

        <div className="h-50">
          <div className="row graybox border-primary h-100">
            <MainApprove user={user}/>
          </div>
        </div>

      </div>

      {/* 세로로 세 번째 줄 */}
      <div className="home-calendar col-4">
        {/* 캘린더 */}
        <div className="h-60 pb-3">
          <div className="home-calendar graybox border-primary">
            <span onClick={toggleCal}>{isSchedule === true ? (<label style={{ cursor: "pointer" }}>개인일정</label>) : (<label style={{ cursor: "pointer" }}>부서일정</label>)}</span>

            {isSchedule === true ? <Calendar /> : <DeptCalendar />}
          </div>
        </div>

        {/* 날씨 */}
        <div className="h-40">
          <div className="home-weather graybox border-primary custom-background text-bold white" style={{ backgroundImage: 'url("img/cloud.jpg")', backgroundSize: 'cover' }}>
            <Weather />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;