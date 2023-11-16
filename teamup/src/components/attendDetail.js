import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";


//dt를 년/월만 나오게 자르는 코드
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

    //attendList에서 최신 날짜의 년도와 월을 가져오는 함수
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

    return (
        <> 
            <div className="container">
                
                <h5 className="text-green text-bold mb-4">{yearMonth} 근태현황</h5>
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
                        {attendList.map(attendLists=>(
                        <tr key={attendLists.empNo}>
                            <td>{attendLists.dt}</td>
                            <td>{attendLists.attendStart ? formatTime(attendLists.attendStart) : "-"}</td>
                            <td>{attendLists.attendEnd ? formatTime(attendLists.attendEnd) : "-"}</td>
                            <td>{attendLists.attendEnd ? attendLists.workingTimes + " 시간": "-"}</td>
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