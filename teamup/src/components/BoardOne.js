import React from 'react';
import { useRecoilState } from 'recoil';
import { companyState, userState } from '../recoil';
import { useNavigate } from 'react-router';
import axios from 'axios';

const BoardOne = ({ idx, writer, title, dept, contents, writeDate, updateDate, count }) => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const deptNo = user.substring(4, 6);
    const [comId] = useRecoilState(companyState);

    // 수정 버튼 렌더링을 위한 조건 추가
    const empNoWithoutLeadingZero = String(Number(empNo));
    const isAuthor = empNoWithoutLeadingZero === String(writer);

    console.log("writer",writer);
    console.log("empNo",empNo);

    //목록버튼을 누르면 목록페이지로 이동
    const moveToBoard = ()=>{
      navigate('/board');
    };

    //수정버튼을 누르면 수정페이지로 이동
    const moveToUpdate = ()=>{
      navigate('/board/update/'+idx);
    };

    //삭제버튼을 누르면 삭제
    const deleteBoard = async ()=>{
      if(window.confirm('공지사항을 삭제하시겠습니까?')){
        await axios.delete(`${process.env.REACT_APP_REST_API_URL}/board/${idx}`).then(response=>{
          navigate('/board');
        });
      }
    };



  return (
    <div className="row">
    <div className="col-md-10 offset-md-1">

    <div className="row mb-2">
        <div className="col-6 ">
                <h4>공지사항 상세</h4>
        </div>
        <div className="col-6 text-end">
                <button className="btn btn-primary text-white"
                               onClick={moveToBoard}>목록</button>
                                {console.log('isAuthor:', isAuthor)}
                         {isAuthor && (
                            <>
                              <button className="btn btn-success text-white ms-1" onClick={moveToUpdate}>
                                수정
                              </button>
                              <button className="btn btn-danger text-white ms-1" onClick={deleteBoard}>
                                삭제
                              </button>
                            </>
                          )}
        </div>
    </div>

    <table className='table table-bordered'>
      <tr>
          <th colSpan={1}>제목</th>
          <td colSpan={5}>{title}</td>
      </tr>
      <tr>
          <th colSpan={1}>부서</th>
          <td colSpan={1}>{dept}</td>
          <th colSpan={1}>작성자</th>
          <td colSpan={1}>{writer}</td>
          <th colSpan={1}>조회수</th>
          <td colSpan={1}>{count}</td>
      </tr>
      <tr>
          <th colSpan={1}>작성일</th>
          <td colSpan={2}>{writeDate}</td>
          <th colSpan={1}>수정일</th>
          <td colSpan={2}>{updateDate}</td>
      </tr>
      <tr>
        <td colSpan={6}>{contents}</td>
      </tr>
    </table>


    </div></div>
  );
};

export default BoardOne;