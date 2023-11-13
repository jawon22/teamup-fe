import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { Modal } from "bootstrap";

const Search = () => {
    const location = useLocation();
    const [searchList, setSearchList] = useState([]);
    const [addressList, setAddressList] = useState([]);

    const loadAddress = () => {

        axios({
            url:"http://localhost:8080/addr/myAddrList/13",
            method:"get"

        }).then(response=>{
            setAddressList(response.data);
        }
            
        )

    };

    const [data, setData] = useState({
        comId: null,
        comName: null,
        deptNo: 0,
        empNo: 0,
        deptName: null,
        empName: null,
        empId: null,
        empPositionName: null,
        empPositionNo: 0,
        empEmail: null,
        joinStart: null,
        joinEnd: null,
        empTel: null,
        salMax: 0,
        salMin: 0
    });
    const dataChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })

    };

    const loadForSearch = () => {

        axios({
            url: "http://localhost:8080/emp/search/",
            method: "post",
            data: data

        }).then(response => {
            console.log(response.data)
            console.log(data.comId)
            console.log(data.deptNo)
            console.log("???", searchList.deptNo)
            setSearchList(response.data)
        }).catch();
    };

    useEffect(() => {
        loadForSearch();
        loadAddress();

    }, []);


    
    const [profile, setProfile] = useState({
        profileNo:null,
        empNo:null,
        deptName:null,
        empPositionName:null,
        empName:null,
        empTel:null,
        empEmail:null,
        empJoin:null
    });
    
    //프로필 조회
    const loadProfile = (empNo) => {
        axios ({
            url:`http://localhost:8080/profile/${empNo}`,
            method:"get"
        })
        .then(response =>{//성공
            console.log(response);
            setProfile(response.data);
        })
        .catch(err=>{});//실패
    };

    useEffect(()=>{
        loadProfile();
    },[]);

     // 프로필 버튼 클릭 시 처리
     const handleProfileButtonClick = (empNo) => {
        // 해당 직원의 프로필을 불러옴
        loadProfile(empNo);
        // 모달 창 열기
        openModal();
    };

    //모달 관련 처리
    const bsModal = useRef();
    const openModal = () =>{
        const modal = new Modal(bsModal.current);
        modal.show();
    };
    const closeModal = () =>{
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
        // clearProfile();
    };


    return (
        <>
            <h1>복합검색</h1>
            <div className="container">

                <div className="row">
                    <div className="col-2">
                        <select onChange={dataChange} name="select" class="form-select" id="exampleSelect">
                            <option value="d.dept_name">부서</option>
                            <option value="e.emp_name">이름</option>
                            <option value="ep.emp_position_name">직급</option>
                        </select>
                    </div>

                    <div className="col-5">
                        <input className="form-control" name="keyword" onChange={dataChange} placeholder="검색어 입력" />
                    </div>

                    <div className="col-2">
                        <input type="date" className="form-control" name="joinStart" value={data.joinStart} onChange={dataChange} placeholder="검색어 입력" />
                    </div>

                    <div className="col-2">
                        <input type="date" className="form-control" name="joinEnd" onChange={dataChange} placeholder="검색어 입력" />
                    </div>

                    <div className="col-1">
                        <button onClick={loadForSearch}>검색</button>
                    </div>
                </div>


                <table className="table table-border">
                    <thead>
                        <tr>
                            <th>사번</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>이름</th>
                            <th>email</th>
                            <th>입사일</th>
                            <th>전화번호</th>
                            <th>프로필</th>
                        </tr>
                    </thead>
                    <tbody >
                        {searchList.map(list => (
                            <tr key={list.empNo}>
                                <td>{list.empId}</td>
                                <td>{list.deptName}</td>
                                <td>{list.empPositionName}</td>
                                <td>{list.empName}</td>
                                <td>{list.empEmail}</td>
                                <td>{list.empJoin}</td>
                                <td>{list.empTel}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary" onClick={openModal}>프로필</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>


            {/* Modal */}
            <div className="modal fade" ref={bsModal} 
                      data-bs-backdrop="static" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">프로필</h5>
                            <button type="button" className="btn-close" data-dismiss="modal" onClick={closeModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col">
                                    <p>이름 : {profile.empName}</p>
                                </div>
                            </div>
                            
          
                        </div>
                        <div className="modal-footer">
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-success">수정</button>
                                    <button className="btn btn-secondary ms-1" onClick={closeModal}>닫기</button>
                                </div>
                            </div>
          
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};
export default Search;