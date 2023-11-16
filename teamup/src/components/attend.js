import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";



const Attend = (props) => {
    const [user, setUser] = useRecoilState(userState);

    const empNo = user.substring(6);
    
    const [attendList, setAttendList] = useState([]);

    useEffect(()=>{
         // axios({}).then({}).catch({});
         axios({
            url:`http://localhost:8080/attend/findSysdate/${empNo}`,
            method:"post"

        }).then(response=>{
            setAttendList(response.data);

        }).catch(err=>{
            window.alert("통신 오류가 발생했습니다.");
        })
    }, []);


    // - 총 근무일 수 계산
    // null이 아닌 날만 필터링하여 개수 세기
    const totalWorkDays = attendList.filter(
        (attend) => attend.attendStart !== null && attend.attendEnd !== null
    ).length;

    // - 총 근무 시간 계산
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

    return (
        <>
            <div className="container p-4">
                
                <div className="row d-flex">

                <div className="text-green text-bold mb-4">{yearMonth} 근태현황</div>
                    
                </div>
                <hr className="text-green"/>


                <div className="row d-flex">
                    <div className="col-6">
                        <div>총 근무일 수</div>
                        <div>총 근무 시간 </div>
                    </div>
                    <div className="col-6">
                        <div>{totalWorkDays} 일</div>
                        <div>{totalWorkingHours} 시간</div>
                    </div>
                </div>

            </div>

        </>
    );

};

export default Attend;