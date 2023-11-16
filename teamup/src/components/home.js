import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { userState } from "../recoil";
import {CgProfile} from "react-icons/cg";//임시프로필사진
import Calendar from "./calendar";
import './homeStyle.css';

const Home = () => {
  const [user, setUser] = useRecoilState(userState);
  const [empNo] = useState(user.substring(6));

  const [attendList, setAttendList] = useState([]);


  const loadAttend = () => {
    axios({
      url: `http://localhost:8080/attend/${empNo}`,
      method: "post",
    })
    .then(response=>{
        setAttendList(response.data);
    })
    .catch((err) => {
        window.alert("통신 오류가 발생했습니다.");
    });
  };

  const attendClick = () => {
    axios({
      url: `http://localhost:8080/attend/${empNo}`,
      method: "post",
    })
    .then(response=>{
        setAttendList(response.data);
    })
    .catch((err) => {
        window.alert("통신 오류가 발생했습니다.");
    });
  };

  useEffect(() => {
    // 페이지 로드 시 출근 내역을 불러옴
    attendClick();
  }, []);

    return (
    <div className="container-fluid">
        <div className="row ms-3">

            <div className="col-3">

              <div className="row border border-primary h-100">
                    <h1 >홈페이지</h1>
                    <CgProfile className="me-3" size={150}style={{color:'#218C74'}} />
                  <div className="d-flex">
                  <div>{attendList.attendStart}</div>
                  <button className="btn btn-primary" onClick={attendClick}>출근하기</button>
                  </div>
                  <div className="d-flex">
                    <div>시간</div>
                    <button className="btn btn-primary">퇴근하기</button>
                  </div>
              </div>
              <div className="row border border-primary h-50 h1">
                TodoList
              </div>

            </div>

            <div className="col-5">
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

            <div className="col-4 border border-primary h-100">
            <Calendar/>
            </div>

        </div>
  
  
    </div>);

};

export default Home;
