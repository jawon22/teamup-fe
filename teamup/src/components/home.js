import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { userState } from "../recoil";
import {CgProfile} from "react-icons/cg";//임시프로필사진
import Calendar from "./calendar";
import './homeStyle.css';

const Home = () => {
  //사원정보
  const [user, setUser] = useRecoilState(userState);
  const [empNo, setEmpNo] = useState('');

  // 출근 버튼 클릭 여부를 관리하는 상태 추가
  const [isAttendClicked, setIsAttendClicked] = useState(false); 
  useEffect(() => {
    setEmpNo(user.substring(6));
  }, [user]);

  const [attendList, setAttendList] = useState([]);

  //- 출근하기 버튼을 눌렀을 때
  const attendStartClick = () => {
    if (isAttendClicked) {
      // 이미 버튼이 클릭되었으면 더 이상 실행하지 않음
      return;
    }

    //등록 axios
    axios({
      url: `http://localhost:8080/attend/${empNo}`,
      method: 'post',
      data: {empNo: empNo}
    })
    .then(response => {
      setAttendList(response.data);
      // 로컬 스토리지에 데이터 저장
      localStorage.setItem("attendData", JSON.stringify(response.data));
      // 출근 버튼 클릭 여부 업데이트
      setIsAttendClicked(true);
    })
    .catch(err => {
      window.alert("통신 오류가 발생했습니다!");
    });
};

useEffect(() => {
  
}, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

  //- 퇴근하기 버튼을 눌렀을 때
  const attendEndClick = () => {
    axios({
      url: `http://localhost:8080/attend/${empNo}`,
      method: "patch"
    })
    .then(response => {
      setAttendList(response.data);
      // 로컬 스토리지에 데이터 저장
      localStorage.setItem("attendData", JSON.stringify(response.data));
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

  useEffect(() => {
    // 페이지가 로드될 때 로컬 스토리지에서 데이터를 불러와서 상태에 업데이트
    const storedData = JSON.parse(localStorage.getItem("attendData"));
    if (storedData) {
      setAttendList(storedData);
      // 저장된 데이터가 있으면 출근 버튼을 클릭한 것으로 처리
      setIsAttendClicked(true);
    }
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

  return (
    <div className="container-fluid">
        <div className="row ms-3">


            <div className="home-profile col-3">

              <div className="row border border-primary h-100">
                    <h1 >홈페이지</h1>
                    <CgProfile className="me-3" size={150}style={{color:'#218C74'}} />
                  <div className="d-flex">
                  <div>{attendList.attendStart}</div>
                  <button className="btn btn-primary" >출근하기</button>


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
