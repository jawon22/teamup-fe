import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { LuClipboardList } from "react-icons/lu";

const Attend = (props) => {

    //사원정보
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6);
    
    //근태내역 관리 state
    const [attendList, setAttendList] = useState([]); 

    //현재 년월 관리 state
    const [clientYearMonth, setClientYearMonth] = useState(""); 
  
    //상세보기 버튼 상태 state
    const [show, setShow] = useState(false);

 

    // - 현재 년, 월을 기준으로 목록 조회
    useEffect(()=>{
         // axios({}).then({}).catch({});
         axios({
            url: `${process.env.REACT_APP_REST_API_URL}/attend/findSysdate/${empNo}`,
            method:"post"

        }).then(response=>{
            setAttendList(response.data);

        }).catch(err=>{
        })
    }, [props.user]);


    // - 총 근무일 수 계산
    // null이 아닌 날만 필터링하여 개수 세기
    const totalWorkDays = attendList.filter(
        (attend) => attend.attendStart !== null && attend.attendEnd !== null
    ).length;

    // - 총 근무 시간 계산
    const totalWorkingHours = attendList.reduce((total, attend) => {
        if (attend.attendStart !== null && attend.attendEnd !== null) {
            return total + attend.workingTimes;
        }
        return total;
    }, 0);

    // - attendList에서 최신 날짜의 년도와 월을 가져오는 함수
    function getLatestYearMonth(attendList) {

        // attendList를 날짜 기준으로 정렬 (가장 최신 날짜가 첫 번째로 오도록)
        const sortedAttendList = attendList.sort((a, b) => new Date(b.dt) - new Date(a.dt));

        // 가장 최신 날짜의 년도와 월 가져오기
        const latestDate = sortedAttendList[0] ? new Date(sortedAttendList[0].dt) : null;
        const latestYear = latestDate ? latestDate.getFullYear() : null;
        const latestMonth = latestDate ? latestDate.getMonth() + 1 : null; // 월은 0부터 시작하므로 1을 더함

        // 최신 날짜의 년도와 월 반환
        return `${latestYear}년 ${latestMonth}월`;
        }

        const yearMonth = getLatestYearMonth(attendList);
    
    // - 시간 형식 포맷팅 함수
    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
  
  // 1 화면 실행 시에는 이번 달 근태내역 출력
  const attendDetail = () => {
    
    clearAttendList(); //초기화

    //서버에서 sysdate로 근태내역 불러옴
    axios({
      url:  `${process.env.REACT_APP_REST_API_URL}/attend/findSysdate/${empNo}`,
      method: "post",
    })
      .then((response) => {
        setAttendList(response.data);

        // 최신 날짜의 년도와 월 가져와서 state로 설정
        const latestYearMonth = getLatestYearMonth(response.data);
        setClientYearMonth(latestYearMonth);
      })
      .catch((err) => {
      });
  };

  // 최초 1번 실행
  useEffect(() => {
    attendDetail();
  }, [props.user]);

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
      url:  `${process.env.REACT_APP_REST_API_URL}/attend/findSearch/${empNo}`,
      method: "post",
      data: { empNo: empNo, yearMonth: newYearMonth },
    })
      .then((response) => {
          setAttendList(response.data);
          setClientYearMonth(newYearMonth);
      })
      .catch((err) => {
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
      url:  `${process.env.REACT_APP_REST_API_URL}/attend/findSearch/${empNo}`,
      method: "post",
      data: { empNo: empNo, yearMonth: newYearMonth },
    })
      .then((response) => {
        setAttendList(response.data);
        setClientYearMonth(newYearMonth);
      })
      .catch((err) => {
      });
  };

  //attendList에서 최신 날짜의 년도와 월을 가져오는 함수
  function getLatestYearMonth(attendList) {

    // attendList가 비어있는 경우에 대한 예외처리
    if (attendList.length === 0) {
        return "No Data"; // 또는 다른 기본값으로 설정
    }


    const sortedAttendList = attendList.sort(
      (a, b) => new Date(b.dt) - new Date(a.dt)
    );

    const latestDate = sortedAttendList[0]
      ? new Date(sortedAttendList[0].dt)
      : null;

      // latestDate가 null인 경우에 대한 예외처리
    if (!latestDate) {
        return "No Data"; // 또는 다른 기본값으로 설정
    }

    const latestYear = latestDate ? latestDate.getFullYear() : null;
    const latestMonth = latestDate ? latestDate.getMonth() + 1 : null;
    return `${latestYear}-${(latestMonth).toString().padStart(2, "0")}`;
  }

  const handleShowClick = () => {
    setShow(!show);
  };


    return (
        <>
            <div className="container p-4">
                
                <div className="row d-flex">

                {/* <div className="text-green text-bold mb-4">{yearMonth} 근태현황</div>
                 */}
                 <h5 className="text-green text-bold mb-4">
                    <button className="btn btn-primary me-2" onClick={attendLastClick}>
                    <SlArrowLeft />
                    </button>
                    {clientYearMonth}
                    <button className="btn btn-primary ms-2" onClick={attendNextClick}>
                    <SlArrowRight />
                    </button>
                </h5>
                <div className="d-flex row mt-4">
                    <div className="col-6 offset-3">
                        <LuClipboardList /><span className="ms-1 text-bold">근태현황</span>
                    </div>
                    <div className="col">
                        <button onClick={handleShowClick} className="btn btn-primary custom-btn ms-5">상세보기</button>
                    </div>
                </div>
                    
                </div>
                <hr className="text-green"/>


                <div className="row d-flex">
                    <div className="col-6">
                        <div className="text-bold">총 근무일 수</div>
                        <div className="text-bold">총 근무 시간 </div>
                    </div>
                    <div className="col-6">
                        <div>{totalWorkDays} 일</div>
                        <div>{totalWorkingHours} 시간</div>
                    </div>
                </div>

            </div>

            <div className="">
      </div>
      <div className="container">

        
      

        
      <div className={`attendList ${show ? 'show' : 'hide'}`}>

          <table className="table">
            <thead className="table-primary">
              <tr>
                <th>근무일자</th>
                <th>출근시각</th>
                <th>퇴근시각</th>
                <th>근무시간</th>
                <th>근무상태</th>
              </tr>
            </thead>
            <tbody>
              {attendList.map((attendLists,index) => (
                <tr key={index}>
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
                  <td>{attendLists.attendStart && attendLists.attendEnd ? attendLists.attendStatus : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

        </>
    );

};

export default Attend;