import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";

const Attend = (props) => {
    const [user, setUser] = useRecoilState(userState);

    const empNo = user.substring(6);
    
    const [attendList, setAttendList] = useState([]);

    const loadAttend = ()=> {
        
        // axios({}).then({}).catch({});
        axios({
            url:`http://localhost:8080/attend/findSysdate`,
            data: empNo,
            method:"post"

        }).then(response=>{
            setAttendList(response.data);

        }).catch(err=>{
            window.alert("통신 오류가 발생했습니다.");
        });
    };

    useEffect(()=>{
        loadAttend();
    }, []);

    return (
        <>
            <div className="container p-4">
                
                <div className="row d-flex">

                    <div className="col-4">
                        <div className="center">?월</div>
                    </div>
                    <div className="col-4">
                        <div className="center">근태현황</div>
                    </div>
                    <div className="col-4">
                        <button className="btn btn-primary">상세보기</button>
                    </div>
                    
                </div>
                <hr/>


                <div className="row d-flex">
                    <div className="col-6">
                        <div>총 근무일 수</div>
                        <div>총 근무 시간 </div>
                    </div>
                    <div className="col-6">
                        <div>? 일</div>
                        <div> ? 시간</div>
                    </div>
                </div>

            </div>

        </>
    );

};

export default Attend;