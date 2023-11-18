import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { userState } from "../recoil";
import {CgProfile} from "react-icons/cg";//임시프로필사진
import Calendar from "./calendar";


import './homeStyle.css';
import Todo from "./TodoList/todo";
import TodoTemplate from "./TodoList/TodoTemplate";
import TodoHead from "./TodoList/TodoHead";
import TodoList from "./TodoList/TodoList";
import TodoCreate from "./TodoList/TodoCreate";



const Home = () => {
  const [user, setUser] = useRecoilState(userState);
  const [empNo, setEmpNo] = useState('');
  const [isAttendClicked, setIsAttendClicked] = useState(false);

  //등록을 위한 state
  const [attendList, setAttendList] = useState([]);

  //수정을 위한 state
  const [attendUpdateList, setAttendUpdateList] = useState([]);

  useEffect(() => {
    setEmpNo(user.substring(6));
  }, [user]);

  //등록 (출근버튼)
  const attendStartClick = () => {

    //버튼이 클릭된 상태일때
    if (isAttendClicked) {
      return;
    }

    axios({
      url: `http://localhost:8080/attend/${empNo}`,
      method: 'post',
      data: { empNo: empNo }
    })
      .then(response => {
        setAttendList(response.data);
        setIsAttendClicked(true);
      })
      .catch(err => {
        window.alert("통신 오류가 발생했습니다!");
      });
  };

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

        <div className="row ms-3">


            <div className="home-profile col-3">

              <div className="row border border-primary h-50 mb-5 pb-5">
                    <h1 >홈페이지</h1>
                    <CgProfile className="me-3" size={100}style={{color:'#218C74'}} />

              <div className="row">
                    <div className="col-6">
                      {attendList.attendStart ? formatDateTime(attendList.attendStart) : "-"}
                      <button className="btn btn-primary" onClick={attendStartClick} disabled={isAttendClicked}>
                        출근하기
                      </button>
                    </div>
                    <div className="col-6">
                      {attendList.attendEnd ? formatDateTime(attendList.attendEnd) : "-"}
                      <button className="btn btn-primary" onClick={attendEndClick}>퇴근하기</button>
                    </div>
              </div>


              </div>

              <div className="row h-50 me-1">
                <TodoTemplate>
                  <TodoHead/>
                  <TodoList/>
                  <TodoCreate/>
                </TodoTemplate>
              </div>

            </div>

            <div className="home-center col-5">
                <div className="row border border-primary h-50">
                  공지사항
                </div>
                <div className="row border border-primary h-50">
                  전자 결재
                </div>
                <div className="row border border-primary h-50">
                  전체 일정
                </div>
            </div>

            <div className="home-calendar col-4 border border-primary h-100">
            <Calendar/>
            </div>

        </div>
  
  
    </div>);




};

export default Home;
