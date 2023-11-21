import { useRecoilState } from "recoil";
import { companyState, loadingState, userState } from "../recoil";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import axios from "axios";
import BoardOne from "./BoardOne";

const BoardDetail=(props)=>{
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const deptNo = user.substring(4, 6);
    const [comId] = useRecoilState(companyState);
    const {idx} = useParams();// /board/:idx와 동일한 변수명으로 데이터를 꺼낼 수 있음.
    const [loading, setLoading] = useRecoilState(loadingState);
    const [board, setBoard] = useState({});


    const getBoard = async ()=>{
        const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/board/find/${idx}`);
        setBoard(response.data); // 추가: board 상태 업데이트
        setLoading(false); // 추가: 데이터 로딩 완료 시 loading 상태 업데이트
    };
    useEffect(()=>{
        getBoard();
    },[]);


    return(
        <div>
            {loading ?(
                <h2>loading...</h2>
            ) : (
                <BoardOne
                    idx={board.boardNo}
                    writer={board.empNo}
                    title={board.boardTitle}
                    contents={board.boardContent}
                />
            )}
        </div>
    );
};
export default BoardDetail;