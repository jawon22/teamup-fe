
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";


const Attend = (props) => {

    const [user, setUser] = useRecoilState(userState);

    const empNo = user.substring(6);

    const [attendList, setAttendList] = useState([]);
    const [loadAttendList, setLoadAttendList] = useState([]);
    const [clientYearMonth, setClientYearMonth] = useState(""); // state로 현재 년월 관리

    
    // dt를 년/월만 나오게 자르는 코드
    function extractYearMonth(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌

    // 원하는 형식으로 조합하여 반환
      return `${year}년 ${month}월 `;
    }

    // 시간 형식 포맷팅 함수
    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
  
   //화면 실행 시에는 이번 달 근태내역 출력
const attendDetail = () => {
  clearAttendList();

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
  
    useEffect(() => {
      attendDetail();
    }, []);

    //초기화
    const clearAttendList = () => {
      setAttendList([]);
    };

    //이전 버튼을 눌렀을 때
    const attendLastClick = () => {
      if (!attendList.length) {
        alert("근태내역이 없습니다.");
        return; 
      } else {
        clearAttendList();
        attendLastMonth();
      }
    };

    //한 달 전 근태내역 출력
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

  axios({
    url: `http://localhost:8080/attend/findSearch/${empNo}`,
    method: "post",
    data: { empNo: empNo, yearMonth: newYearMonth },
  })
    .then((response) => {
      if (!response.data) {
        alert("근태내역이 없습니다.");
      } else {
        setAttendList(response.data);

        setClientYearMonth(newYearMonth);
      }
    })
    .catch((err) => {
      window.alert("통신 오류가 발생했습니다.");
    });
};

    //다음 버튼을 눌렀을 때
    const attendNextClick = () => {
      if (!attendList.length) {
        alert("근태내역이 없습니다.");
        return;
      } else {
        clearAttendList();
        attendNextMonth();
      }

    };
  
    // 다음 버튼을 누를 시에는 한 달 후 근태내역 출력
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

  axios({
    url: `http://localhost:8080/attend/findSearch/${empNo}`,
    method: "post",
    data: { empNo: empNo, yearMonth: newYearMonth },
  })
    .then((response) => {
      if (!response.data) {
        alert("근태내역이 없습니다.");
      } else {
        setAttendList(response.data);
        setClientYearMonth(newYearMonth);
      }
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
                  <td>?</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };
  
  export default Attend;
