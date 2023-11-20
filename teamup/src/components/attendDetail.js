
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";


const Attend = (props) => {

  const [user, setUser] = useRecoilState(userState);
  const empNo = user.substring(6);

  const [attendList, setAttendList] = useState([]); //state로 근태 내역 관리
  const [clientYearMonth, setClientYearMonth] = useState(""); // state로 현재 년월 관리

  // 시간 형식 포맷팅 함수
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // 1 화면 실행 시에는 이번 달 근태내역 출력
  const attendDetail = () => {
    
    clearAttendList(); //초기화

    //서버에서 sysdate로 근태내역 불러옴
    axios({
      url: `http://localhost:8080/attend/findSysdate/${empNo}`,
      method: "post",
    })
      .then((response) => {
        setAttendList(response.data);

        // 최신 날짜의 년도와 월 가져와서 state로 설정
        const latestYearMonth = getLatestYearMonth(response.data);
        setClientYearMonth(latestYearMonth);
      })
      .catch((err) => {
        window.alert("통신 오류가 발생했습니다.");
      });
  };

  // 최초 1번 실행
  useEffect(() => {
    attendDetail();
  }, []);

  // 초기화 함수
  const clearAttendList = () => {
    setAttendList([]);
  };

  // 현재 월인지 확인하는 함수
  function isCurrentMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const [year, month] = clientYearMonth.split("-").map(Number);
    return currentYear === year && currentMonth === month;
  }

  // 2 이전 버튼을 눌렀을 때
  const attendLastClick = () => {
      clearAttendList();
      attendLastMonth();
  };


  // 2 한 달 전 근태내역 출력
  const attendLastMonth = () => {

    // 현재 년월을 Date 객체로 파싱
    const currentDate = new Date(clientYearMonth);
    // 한 달 전 날짜 계산
    currentDate.setMonth(currentDate.getMonth() - 1);
    // 계산된 날짜를 "YYYY-MM" 형식의 문자열로 변환
    const newYearMonth = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    //서버에서 사용자가 입력한 년, 월로 근태내역 불러옴
    axios({
      url: `http://localhost:8080/attend/findSearch/${empNo}`,
      method: "post",
      data: { empNo: empNo, yearMonth: newYearMonth },
    })
      .then((response) => {
          setAttendList(response.data);
          setClientYearMonth(newYearMonth);
      })
      .catch((err) => {
        window.alert("통신 오류가 발생했습니다.");
      });
  };

  // 2 다음 버튼을 눌렀을 때
  const attendNextClick = () => {
      clearAttendList();
      // 현재 년 월인 경우에만 attendDetail() 호출
      if (isCurrentMonth()) {
        attendDetail();
      } else {
        attendNextMonth();
      }
  };

  //한 달 후 근태내역 출력
  const attendNextMonth = () => {
    // 현재 년월을 Date 객체로 파싱
    const currentDate = new Date(clientYearMonth);
    // 한 달 후 날짜 계산
    currentDate.setMonth(currentDate.getMonth() + 1);
    // 계산된 날짜를 "YYYY-MM" 형식의 문자열로 변환
    const newYearMonth = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    //서버에서 사용자가 입력한 년, 월로 근태내역 불러옴
    axios({
      url: `http://localhost:8080/attend/findSearch/${empNo}`,
      method: "post",
      data: { empNo: empNo, yearMonth: newYearMonth },
    })
      .then((response) => {
        setAttendList(response.data);
        setClientYearMonth(newYearMonth);
      })
      .catch((err) => {
        window.alert("통신 오류가 발생했습니다.");
      });
  };

  //attendList에서 최신 날짜의 년도와 월을 가져오는 함수
  function getLatestYearMonth(attendList) {
    const sortedAttendList = attendList.sort(
      (a, b) => new Date(b.dt) - new Date(a.dt)
    );
    const latestDate = sortedAttendList[0]
      ? new Date(sortedAttendList[0].dt)
      : null;
    const latestYear = latestDate ? latestDate.getFullYear() : null;
    const latestMonth = latestDate ? latestDate.getMonth() + 1 : null;
    return `${latestYear}-${(latestMonth).toString().padStart(2, "0")}`;
  }

  return (
    <>
      <div className="container">
        <h5 className="text-green text-bold mb-4">
          <button className="btn btn-primary me-2" onClick={attendLastClick}>
            이전<SlArrowLeft />
          </button>
          {clientYearMonth}
          <button className="btn btn-primary ms-2" onClick={attendNextClick}>
            다음<SlArrowRight />
          </button>
        </h5>

        <table className="table">
          <thead className="t-border">
            <tr>
              <th>근무일자</th>
              <th>출근시각</th>
              <th>퇴근시각</th>
              <th>근무시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {attendList.map((attendLists) => (
              <tr key={attendLists.empNo}>
                <td>{attendLists.dt}</td>
                <td>
                  {attendLists.attendStart
                    ? formatTime(attendLists.attendStart)
                    : "-"}
                </td>
                <td>
                  {attendLists.attendEnd
                    ? formatTime(attendLists.attendEnd)
                    : "-"}
                </td>
                <td>
                  {attendLists.attendEnd
                    ? attendLists.workingTimes + " 시간"
                    : "-"}
                </td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Attend;
