import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { userState } from "../recoil";

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
        <div className="col">
          <h1>홈페이지</h1>
          <NavLink to="/myPage">마이페이지</NavLink> <br />
          <NavLink to="/profileEdit">프로필 수정(마이페이지에 넣을껍니당)</NavLink>{" "}
          <br />
          <NavLink to="/calendar">일정</NavLink>
          <br />
          <div className="d-flex">
            <div className="m-1">{attendList.attendStart ? formatDateTime(attendList.attendStart) : "-"}</div>
            <button className="btn btn-primary" onClick={attendStartClick} disabled={isAttendClicked}>
              출근하기
            </button>
          </div>
          <div className="d-flex">
            <div className="m-1">{attendList.attendEnd ? formatDateTime(attendList.attendEnd) : "-"}</div>
            <button className="btn btn-primary" onClick={attendEndClick}>퇴근하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
