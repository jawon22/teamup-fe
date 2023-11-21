import { useRecoilState } from "recoil";
import { companyState, userState } from "../recoil";
import { useState } from "react";

const BoardDetail=(props)=>{
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const deptNo = user.substring(4, 6);
    const [comId] = useRecoilState(companyState);

    const [boardList,setBoardList] = useState({});


    return(
        <div>
            공지사항 상세
        </div>
    );
};
export default BoardDetail;