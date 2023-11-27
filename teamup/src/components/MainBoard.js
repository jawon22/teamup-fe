import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { CiSquarePlus } from "react-icons/ci";

const MainBoard=(props)=>{
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const deptNo = user.substring(4, 6);
    const [comId] = useRecoilState(companyState);
    const [boardList, setBoardList] = useState([]);

    useEffect(()=>{
        boardListByCom();
    },[]);

    
        // 화면 실행시 회사별 공지사항 리스트 출력
        const boardListByCom = () => {
            axios({
                url: `${process.env.REACT_APP_REST_API_URL}/board/list/${comId}`,
                method: "get"
            })
            .then(response => {
                setBoardList(response.data);
            })
            .catch(error => {});
        };

        // 타임스탬프를 날짜로 변환하는 함수
        const formatDate = (timestamp) => {
            const date = new Date(timestamp);
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

            // 현재 날짜와 비교하여 오늘 작성된 경우 시간까지 표시, 그렇지 않은 경우 날짜만 표시
            const today = new Date();
            if (
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            ) {
                // 오늘 작성된 경우
                return date.toLocaleString('ko-KR', { hour: 'numeric', minute: 'numeric' });
            } else {
                // 오늘이 아닌 경우
                return moment(timestamp).format('YYYY-MM-DD');
            }
        };
        
    return(

        <div>

            <div className="row">
                <div className="col-6 mt-4 mb-3 ms-2">
                        <h4>공지사항</h4>
                </div>
            </div>

            <div className="row text-end text-green mb-1 me-1">    
                <div className="col">
                    <Link to={`/Board`} className="link">더보기<CiSquarePlus /></Link>
                </div>
            </div>
                
            <div className="row">
                <div className="col">
                    <table className="table main-board-font" style={{ fontSize: '15px' }}>                       
                        <thead>

                            <tr className="table-primary text-center">
                                <th width="15%">번호</th>
                                <th width="20%">부서</th>
                                <th width="40%">제목</th>
                                <th width="25%">작성일</th>

                            </tr>
                        </thead> 
                        <tbody className="text-center main-board-font">
                            {boardList.map(board=>(
                            <tr key={board.boardNo}>
                                <td>{board.boardNo}</td>
                                <td>{board.deptName}</td>
                                <td className="text-start">
                                    <Link className="custom-link" to={`/board/find/${board.boardNo}`}>{board.boardTitle}</Link>
                                </td>
                                <td>{formatDate(board.boardWriteDate)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                    </div>
                    </div>
                    </div>
    );
};
export default MainBoard;