import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CiSquarePlus } from "react-icons/ci";


const MainApprove = (props)=>{
    const [user,setUser] = useRecoilState(userState);

    const [approveList, setApproveList] = useState([]);
    const empNo = parseInt(user.substring(6)); //로그인한 사람의 사원번호

    const susinList = () =>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/approve/`,
            method:"get"
        })
        .then(response=>{
            const updateApprList = response.data.filter((appr)=> 
                appr.receiversDtoList.some((receiver)=> receiver.receiversReceiver === empNo));
            setApproveList(updateApprList);
        });
    };
    console.log(approveList);

    // 두 날짜 간의 차이를 계산하는 함수
    const calculateDate = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const today = new Date();

        const time = end.getTime() - today.getTime();
    
        if (time >= 24 * 60 * 60 * 1000) {
            const days = time / (1000 * 3600 * 24);
            return `${Math.floor(days)}일`;
        } else {
            const hours = time / (1000 * 3600);
            return `${Math.floor(hours)}시간`;
        }
    };
    
    useEffect(()=>{
        susinList();
    },[])

    return(
        <>
            <div className="row">
                <div className="col-6 mt-4 ms-2">
                    <h4>전자결재</h4>
                </div>
                <div className="col-3">
                    <Link to={`/approveList`}><CiSquarePlus /></Link>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <table className="table">
                        <thead>
                            <tr className="table-primary text-center">
                                <th width="50%">제목</th>
                                <th width="20%">발신인</th>
                                <th width="30%">남은기간</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {Array.isArray(approveList) && approveList.length > 0 ? (
                                approveList
                                .filter((appr) => new Date(appr.approveDto.apprDateEnd) >= new Date())
                                .slice(0, 6)
                                .map((appr) => (
                                    <tr key={appr.approveDto.apprDateStart}>
                                    <td className="text-start">{appr.approveDto.apprTitle}</td>
                                    <td>{appr.empName}</td>
                                    <td>
                                        {calculateDate(
                                        appr.approveDto.apprDateStart,
                                        appr.approveDto.apprDateEnd
                                        )}
                                    </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">수신된 전자 기안문서가 없습니다</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MainApprove;