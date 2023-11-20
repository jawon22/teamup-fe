import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import { TfiPencil } from "react-icons/tfi";

const Board =(props)=>{
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const [comId] = useRecoilState(companyState);

    const [boardList, setBoardList] = useState([]);

    useEffect(()=>{
        boardListByCom();
    },[]);

    //화면 실행시 회사별 공지사항 리스트 출력
    const boardListByCom = ()=>{
        axios({
            url:`http://localhost:8080/board/list/${comId}`,
            method: "get"
        })
        .then(response=>{
            setBoardList(response.data);
        }).catch(error => {
            console.error("공지사항 목록을 가져오는 중 오류가 발생", error);
        });
    };

    return(

        <div className="row">
        <div className="col-md-10 offset-md-1">

            <div className="row mb-2">
                <div className="col-6">
                        <h2>공지사항</h2>
                </div>
                <div className="col-6 text-end">
                        <button className="btn btn-primary text-white">글쓰기<TfiPencil /></button>
                </div>
            </div>
                
            <div className="row">
                <div className="col">
                    <table className="table table-bordered border-primary">
                        
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>작성자</th>
                                <th>부서(카테고리)</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>수정일</th>
                                <th>조회수</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {boardList.map(board=>(
                            <tr key={board.boardNo}>
                                <td>{board.boardNo}</td>
                                <td>{board.empNo}</td>
                                <td>{board.boardCategory}</td>
                                <td>{board.boardTitle}</td>
                                <td>{board.boardWriteDate}</td>
                                <td>{board.boardUpdateDate}</td>
                                <td>{board.boardReadCount}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

        </div></div>
    );
};
export default Board;