import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { deptNoState, nameState, userState } from "../recoil";
import { CgProfile } from "react-icons/cg";//임시프로필사진
import Calendar from "./calendar";
import surf from "./images/profileImage.png";

import './homeStyle.css';
import TodoTemplate from "./TodoList/TodoTemplate";
import TodoHead from "./TodoList/TodoHead";
import TodoList from "./TodoList/TodoList";
import TodoCreate from "./TodoList/TodoCreate";
import { TodoProvider } from "../TodoContext";
import Weather from "./weather";

const Home = (props) => {

  const [user, setUser] = useRecoilState(userState);



  //강사님이 알려주신 거
  // const [empNo, setEmpNo] = useState('');

  //등록을 위한 state
  const [attendList, setAttendList] = useState({});

  //상태판정
  const [flag, setFlag] = useState("출근전");


  const [name ,setName] =useRecoilState(nameState);
  //const [positionName ,setPositionName] =useRecoilState();
  const [deptNo ,setDeptNo] =useRecoilState(deptNoState);

  //사원 
  const [empInfo, setEmpInfo] = useState({
    comId: '',
    deptNo: '',
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
      url: `http://localhost:8080/attend/findTodayAttendByEmpNo/${empNo}`,
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
      url: `http://localhost:8080/attend/${empNo}`,
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
      url: `http://localhost:8080/attend/${empNo}`,
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
      url: `http://localhost:8080/image/profile/${loggedInEmpNo}`,
      method: "get"
    })
      .then(response => {
        setImgSrc(`http://localhost:8080/image/profile/${loggedInEmpNo}`);
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
      const response = await axios.get(`http://localhost:8080/emp/mypage/${empNo}`);
      console.log(response.data);
      setEmpInfo(response.data);

      setName(response.data.empName);
      setDeptNo(response.data.deptNo);
      console.log(name);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};

useEffect(() => {
  myInfo();
}, [props.user]);


  return (

    <div>
      <div className="row ms-4 mt-2 mp">


        {/* 세로로 첫 번째 줄 */}
        <div className="home-profile col-lg-3 col-md-4">

          {/* 프로필과 출퇴근 버튼 */}
          <div className="row h-50 mb-3 p-3 me-1 d-flex graybox 
                                    justify-content-center align-items-center">
            {/* <CgProfile  size={150}style={{color:'#218C74'}} /> */}


            {/* 프로필 */}
            <img src={displayImage} alt="profileImage" id="previewImage" className="rounded-circle"
              style={{ width: "220px", height: "200px", objectFit: "cover" }} />

            <div className="d-flex item-center text-bold">
            <div>{empInfo.empName}</div>
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

          {/* 투두리스트 */}
          <div className="row h-50 me-1 home-todo">
            <TodoProvider>
            <TodoTemplate style={{ width: '100%', height: '100%' }}>
                <TodoHead />
                <TodoList />
                <TodoCreate />
              </TodoTemplate>
            </TodoProvider>
          </div>

        </div>

        {/* 세로로 두 번째 줄 */}
        <div className="home-center col-lg-5">
          <div className="row graybox border-primary h-50">
            공지사항
          </div>
          <div className="row graybox border-primary h-50 mt-3">
            전자결재
          </div>
        </div>

        {/* 세로로 세 번째 줄 */}
        <div className="home-calendar col-lg-4 col-md-8">
          {/* 캘린더 */}
          <div className="home-calendar graybox border-primary h-50 p-3">
            <Calendar />
          </div>

          {/* 날씨 */}
          <div className="home-weather graybox border-primary h-50 p-4 mt-3 custom-background text-bold white" style={{ backgroundImage: 'url("img/cloud.jpg")', backgroundSize: 'cover' }}>
              <Weather />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;