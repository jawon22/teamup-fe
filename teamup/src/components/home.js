import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { userState } from "../recoil";
import { CgProfile } from "react-icons/cg";//임시프로필사진
import Calendar from "./calendar";


import './homeStyle.css';
import TodoTemplate from "./TodoList/TodoTemplate";
import TodoHead from "./TodoList/TodoHead";
import TodoList from "./TodoList/TodoList";
import TodoCreate from "./TodoList/TodoCreate";
import { TodoProvider } from "../TodoContext";



const Home = () => {
  const [user, setUser] = useRecoilState(userState);

  //강사님이 알려주신 거
  // const [empNo, setEmpNo] = useState('');

  //등록을 위한 state
  const [attendList, setAttendList] = useState({});

  //상태판정
  const [flag, setFlag] = useState("출근전");

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
  }, [empNo]);

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
        window.alert("통신 오류가 발생했습니다.!!!");
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
        window.alert("통신 오류가 발생했습니다!");
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
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return new Date(dateTimeString).toLocaleString("ko-KR", options);
  };

  return (
    <div className="container-fluid">

        <div className="row ms-1">

        <div className="home-profile col-3">
              <div className="row border border-primary h-50 mb-3 pb-1 me-1">

                    <CgProfile  size={150}style={{color:'#218C74'}} />

                      <div className="d-flex">
                        <div className="m-1">{attendList.attendStart ? formatDateTime(attendList.attendStart) : "-"}</div>
                        <button className="btn btn-primary" onClick={attendStartClick} 
                        disabled={flag !== "근무전"}>
                          출근하기
                        </button>
                      </div>
                              <div className="d-flex">
                        <div className="m-1">{attendList.attendEnd ? formatDateTime(attendList.attendEnd) : "-"}</div>
                        <button className="btn btn-primary" onClick={attendEndClick}
                          disabled={flag === "근무전"}>퇴근하기</button>
                      </div>

              </div>

              <div className="row h-50 me-1">
                <TodoProvider>
                    <TodoTemplate>
                      <TodoHead/>
                      <TodoList/>
                      <TodoCreate/>
                    </TodoTemplate>                  
                </TodoProvider>
              </div>

              </div>




              <div className="home-center col-5">
                  <div className="row border border-primary h-75">
                    전자 결재
                  </div>

              </div>

              <div className="home-calendar col-4 border border-primary h-100">
              <Calendar/>
              </div>

          </div>

        </div>

    );
};

export default Home;