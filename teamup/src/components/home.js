import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { userState } from "../recoil";

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
    <>
      <h1>홈페이지</h1>

      <NavLink to="/myPage">마이페이지</NavLink> <br />
      <NavLink to="/profileEdit">프로필 수정(마이페이지에 넣을껍니당)</NavLink>

      <div className="d-flex">
        <div>{attendList.attendStart}</div>
        <button className="btn btn-primary" onClick={attendClick}>
          출근하기
        </button>
      </div>
      <div className="d-flex">
        <div>시간</div>
        <button className="btn btn-primary">퇴근하기</button>
      </div>
    </>
  );
};

export default Home;
