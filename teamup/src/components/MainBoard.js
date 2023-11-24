import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import axios from "axios";
import { Link } from "react-router-dom";

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
                console.log("응답 데이터:", response.data);
                setBoardList(response.data);
            })
            .catch(error => {
                console.error("공지사항 목록을 가져오는 중 오류가 발생", error);
            });
        };

    return(

        <div className="">

            <div className="row">
                <div className="col-6 mt-4 mb-3 ms-2">
                        <h4>공지사항</h4>
                </div>
               
            </div>
                
            <div className="row">
                <div className="col">
                    <table className="table"style={{ fontSize: '15px' }}>                       
                        <thead>
                            <tr className="table-primary">
                                <th>번호</th>
                                <th>부서</th>
                                <th>제목</th>
                                <th>작성일</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {boardList.map(board=>(
                            <tr key={board.boardNo}>
                                <td>{board.boardNo}</td>
                                <td>{board.deptName}</td>
                                <td>
                                    <Link className="custom-link" to={`/board/find/${board.boardNo}`}>{board.boardTitle}</Link>
                                </td>
                                <td>{board.boardWriteDate}</td>
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