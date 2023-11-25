import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { companyState, repliesState, userState } from '../recoil';
import { useNavigate } from 'react-router';
import axios from 'axios';

const BoardOne = ({ idx, writer, title, dept, contents, writeDate, updateDate, count, writeName }) => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const deptNo = user.substring(4, 6);
    const [comId] = useRecoilState(companyState);
   const [replyContent, setReplyContent] = useState('');//댓글
   const [replies, setReplies] = useRecoilState(repliesState);// 댓글 목록
   

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

    // 댓글 작성 이벤트 핸들러
    const handleReplySubmit = async () => {
      if (!replyContent) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }

        // 기록 추가
      console.log('댓글 내용:', replyContent);
      console.log('작성자 번호:', empNo);
      console.log('공지사항 번호:', idx);

        // empNo를 숫자로 변환
      const empNoNumber = Number(empNo);

      const replyData = {
        replyContent: replyContent,
        replyWriter: empNoNumber, // 작성자 정보 사용 (여기서는 empNo 변수 사용)
        replyOrigin: idx, // 공지사항의 idx를 댓글의 replyOrigin으로 사용
      };

      try {
        // 댓글 작성 요청
        await axios.post(`${process.env.REACT_APP_REST_API_URL}/reply/`, replyData);
    
        // 댓글 작성 후에 목록을 다시 불러옴
        fetchReplies();
    
        alert('댓글이 작성되었습니다.');
        setReplyContent('');
      } catch (error) {
        console.error('댓글 작성 에러:', error);
        alert('댓글 작성 중 오류가 발생했습니다.');
      }
    };

 // 댓글 목록 불러오기
const fetchReplies = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/reply/list/${idx}`);
    const updatedReplies = response.data;
    setReplies(updatedReplies); // 상태 업데이트

    // 여기서 replies 상태를 사용하는 부분에서 문제가 발생하지 않도록 수정
    console.log('댓글 목록:', updatedReplies);
  } catch (error) {
    console.error('댓글 목록 불러오기 오류:', error);
  }
};

    useEffect(() => {
      fetchReplies();
    }, []); 



  return (
    <div className="row">
    <div className="col-md-10 offset-md-1 ps-5 pe-5">

    <div className="row mb-2">
        <div className="col-6 mt-5 mb-3">
                <h3>공지사항 상세</h3>
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
          <td colSpan={1}>{writeName}</td>
          <th colSpan={1}>조회수</th>
          <td colSpan={1}>{count}</td>
      </tr>
      <tr>
          <th colSpan={1}>작성일</th>
          <td colSpan={2}>{writeDate}</td>
          <th colSpan={1}>수정일</th>
          <td colSpan={2}>{updateDate}</td>
      </tr>
      {/* <tr>
        <td colSpan={6}>{contents}</td>
      </tr> */}
      
    </table>

    {/* 내용 부분 */}
    <div className="row">
      <div className="col-12 p-4">
        {contents}
      </div>
    </div>

     {/* 댓글 입력 폼 */}
     <div className="row mt-4">
        <div className="col-12">
          <h4>댓글 작성</h4>
          <div className="d-flex">
            <textarea
              className="form-control"
              rows="3"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            ></textarea>
            <button className="btn btn-primary mt-2 ms-2" onClick={handleReplySubmit}>
              등록
            </button>
          </div>
        </div>
      </div>


      {/* 댓글 목록 */}
      <div className="row mt-4 mb-5">
        <div className="col-12">
          <h3>댓글 목록</h3>
          <ul className="list-group">
            {replies.map((reply) => (
              <li key={reply.replyNo} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{reply.replyWriterName}</strong>
                    <span className="badge bg-primary ms-2 me-2">{reply.replyWriterDept}</span>
                    <span className="badge bg-secondary me-2">{reply.replyWriterEP}</span>
                  </div>
                  <small>{reply.replyTime}</small>
                </div>
                <div>{reply.replyContent}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>



    </div></div>
  );
};

export default BoardOne;