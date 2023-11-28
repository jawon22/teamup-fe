import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import { useLocation, useNavigate } from 'react-router';

const Com = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //리스트 불러오고 
    const [companyList, setCompanyList] = useState([]);
    //input 의 values
    const [com, setCom] = useState({
        comId: "",
        comPw: "",
        pwRe: "",
        comName: "",
        comPost: "",
        comAddr: "",
        comAddr2: "",
        comTel: "",
        comBs: "",
        comRegion: "",
        comEmail: "",
    });
    //클리어
    const clearCom = () => {
        setCom({
            comId: "",
            comPw: "",
            comName: "",
            comPost: "",
            comAddr: "",
            comAddr2: "",
            comTel: "",
            comBs: "",
            comRegion: "",
            comEmail: "",
        })
    }


    //다음 주소 

    const [post, setPost] = useState("");
    const [address, setAddress] = useState("");

    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        setAddress(data.address);
        setPost(data.zonecode);
        setCom((com) => ({
            ...com,
            comPost: data.zonecode,
            comAddr: data.address,
        }));

    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };




    //목록 불러오기

    const comLoad = () => {
        axios({
            url: ` ${process.env.REACT_APP_REST_API_URL}/com/list`,
            method: "get"
        })
            .then(response => {
                setCompanyList(response.data)
            })
            .catch();
    }

    useEffect(() => {
        comLoad();


    }, []);


    //list의 아이디랑 value의 아이디랑 검사
    //형식검사..
    //비밀번호 확인 
    const [pwRe, setPwRe] = useState("");
    const [result, setResult] = useState({
        id: null,
        pw: null,
        pwcheck: null,
        sameId: null
    });




    const check = () => {

        const checkId = /^[a-z][a-z0-9]{7,19}$/;
        const idMatch = com.comId.length === 0 ? null : checkId.test(com.comId);

        const checkPw = /^[A-Za-z0-9!@#$]{8,16}$/;
        const pwMatch = com.comPw.length === 0 ? null : checkPw.test(com.comPw);

        const pwReMatch = com.pwRe.length === 0 ? null :
            com.pwRe.length > 0 && com.comPw === com.pwRe;
        const isOverlap = companyList.some(company => company.comId === com.comId);

        setResult({
            id: idMatch,
            pw: pwMatch,
            pwcheck: pwReMatch,
            sameId: isOverlap

        });



    }



    const comChange = (e) => {
        setCom({
            ...com,
            [e.target.name]: e.target.value
        });


    }
    //가입 버튼 이벤트 
    const join = () => {
        delete com.pwRe
        axios({
            url:  `${process.env.REACT_APP_REST_API_URL}/com/`,
            method: "post",
            data: com,



        }).then(response => {
            alert("성공")
            setAddress("");
            setPost("")
            navigate('/login');
        }).catch(

        );


    }

    //아이디 검사
    const isIdInCompanyList = (id) => {
        return companyList.some((company) => company.comId === id);
    };



    //있는 아이디 입력하면 있는 아이디 인지 확인 
    //버튼누르면 전송
    //우편번호 카카오우편주소 api
    //아이디 제약조건
    //비밀번호 제약조건
    //상세주소 제약조건
    //이미지 클릭해서 선택할 수 있게  //미리보기

    return (
        <>

            <div className="container">

                <div className="p-5">
                    {/* 로고 */}
                    <div style={{ textAlign: "center" }}>
                        <img src="img/TeamUpLogo.png" style={{ width: "10%", height: "20%" }} alt="TeamUp Logo" />
                    </div>

                    {/* 제목 */}
                    <div className="row mt-5">
                        <div className="col-6 offset-3 text-center">
                            <h4 className="primary text-bold">회사 정보를 입력해주세요.</h4>
                        </div>
                    </div>

                    {/* 회사명 */}
                    <div className="row mt-5">
                        <div className="col-6 offset-3">
                            <label className="form-label">회사명</label>
                            <input className={`form-control 
                      ${com.comName.length > 0 ? 'is-valid' : ''}`
                            } value={com.comName}
                            autoComplete='off'
                            name='comName' onChange={comChange} />
                        </div>
                    </div>

                    {/* 아이디 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">아이디</label>
                            <input className={`form-control 
                      ${result.id === true && result.sameId === false ? 'is-valid' : ''}
                      ${result.id === false || result.sameId === true ? 'is-invalid' : ''}
                      `
                            }
                            autoComplete='off'
                            placeholder='영문 소문자+숫자 8~20자'
                            value={com.comId} name='comId'
                            onChange={comChange} onBlur={check} 
                            />
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">비밀번호</label>
                            <input className={`form-control 
                      ${result.pw === true ? 'is-valid' : ''}
                      ${result.pw === false ? 'is-invalid' : ''}
                      `
                            }
                            autoComplete='off'
                            placeholder='영문 대소문자+숫자+특수기호(!@#$)가능 8~16자'
                            value={com.comPw} name='comPw'
                            onChange={comChange} onBlur={check} type="password" />
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">비밀번호 확인</label>
                            <input className={`form-control 
                      ${result.pwcheck === true ? 'is-valid' : ''}
                      ${result.pwcheck === false ? 'is-invalid' : ''}
                      `
                            }
                                value={com.pwRe} name='pwRe'
                                onChange={comChange} onBlur={check} type="password" />
                        </div>
                    </div>

                    {/* 우편번호 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">우편번호</label>

                            <div className="d-flex input-group">
                                <input className={`form-control
                                ${com.comPost.length > 0 ? 'is-valid' : ''}`
                                } value={com.comPost} 
                                autoComplete='off'
                                name='comPost' onChange={comChange} />
                                <button type='button' className='btn btn-outline-primary ps-4 pe-4' onClick={handleClick}>
                                    검색
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* 주소 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">주소</label>
                            <input className={`form-control
                      ${com.comAddr.length > 0 ? 'is-valid' : ''}
                      `} value={com.comAddr} 
                        autoComplete='off'
                        name='comAddr' onChange={comChange} />
                        </div>
                    </div>

                    {/* 상세 주소 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">상세 주소</label>
                            <input className={`form-control
                      ${com.comAddr2.length > 0 ? 'is-valid' : ''}
                      `} value={com.comAddr2}
                        autoComplete='off'
                        name='comAddr2' onChange={comChange} />
                        </div>
                    </div>

                    {/* 전화 번호 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">전화번호</label>
                            <input className={`form-control
                      ${com.comTel.length > 0 ? 'is-valid' : ''}
                      `} value={com.comTel}
                        autoComplete='off'
                        name='comTel' onChange={comChange} />
                        </div>
                    </div>

                    {/* 사업자 등록번호 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">사업자 등록번호</label>
                            <input className={`form-control
                      ${com.comBs.length > 0 ? 'is-valid' : ''}
                      `} value={com.comBs} 
                        autoComplete='off'
                        name='comBs' onChange={comChange} />
                        </div>
                    </div>

                    {/* 지역 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            지역 <input className={`form-control
                      ${com.comRegion.length > 0 ? 'is-valid' : ''}
                      `} value={com.comRegion} 
                        autoComplete='off'
                        name='comRegion' onChange={comChange} />
                        </div>
                    </div>

                    {/* 이메일 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <label className="form-label">이메일 </label>
                            <input className={`form-control
                      ${com.comEmail.length > 0 ? 'is-valid' : ''}
                      `} value={com.comEmail} 
                        autoComplete='off'
                        name='comEmail' onChange={comChange} />
                        </div>
                    </div>

                    {/* <div className="row mt-4">
                  <div className="col-6 offset-3">
                      이미지 <input type="file" name="attach" value={com.attach} className={`form-control`} onChange={comChange} />
                  </div>
              </div> */}

                    {/* 가입 버튼 */}
                    <div className="text-center row mt-4">
                        <div className="col-3 offset-3">
                            <button className="btn btn-primary ps-5 pe-5 pt-2 pb-2 text-bold" onClick={join}
                                disabled={!(result.id === true && result.pw === true
                                    && result.pwcheck === true)}
                            >가입하기</button>
                        </div>
                    </div>
                </div>
            </div>




            {/* {companyList.map(company => ( */}
                {/* <div key={company.comId}> */}
                    {/* <p>comId: {company.comId}</p> */}
                    {/* Add other properties you want to display */}
                {/* </div> */}
            {/* ))} */}



        </>
    );
};
export default Com;