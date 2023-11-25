import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { companyState, userState } from "../recoil";
import { useRecoilState } from "recoil";

const BoardUpdate =()=> {
    const navigate = useNavigate();
    const {idx} = useParams();
    const [user, setUser] = useRecoilState(userState);
    const [comId] = useRecoilState(companyState);

    const [board, setBoard] = useState({
      idx: 0, empNo:'', boardTitle:'', deptNo:'', boardContent:'', boardWriteDate:'', boardUpdateDate: '', boardReadCount:''
    });

    const { empNo, boardTitle, deptNo, boardContent, boardWriteDate, boardUpdateDate, boardReadCount} = board;

    const onChange = (e) =>{
        const {value, name} = e.target;
        setBoard({
            ...board,
            [name] : value,
        });
    };

    const getBoard = () => {
        axios
          .get(`${process.env.REACT_APP_REST_API_URL}/board/find/${idx}`)
          .then((response) => {
            console.log('Response data:', response.data);
            setBoard(response.data);
          })
          .catch((error) => {
            console.error('Error fetching board:', error);
          });
      };

    const updateBoard = async ()=>{
        await axios.put(`${process.env.REACT_APP_REST_API_URL}/board/${idx}`, board)
        .then(response=>{
            alert('수정되었습니다.');
            navigate('/board/find/'+idx);
        });
    };

    const backToDetail = ()=>{
        navigate('/board/find/'+ idx);
    };

    useEffect(()=>{
        getBoard();
    },[])

    return(
        <div className="row">
    <div className="col-md-10 offset-md-1 mt-5">

    <table className='table table-bordered mt-4'>
      <tr>
          <th colSpan={1}>제목</th>
          <td colSpan={5}><input className="w-100" type="text" name="boardTitle"
           value={board.boardTitle} onChange={onChange}
           style={{ border: 'none', boxShadow: 'none',outline: 'none' }}
           autoComplete="off"/></td>
      </tr>
      <tr>
          <th colSpan={1}>부서</th>
          <td colSpan={1}>{board.deptNo}</td>
          <th colSpan={1}>작성자</th>
          <td colSpan={1}>{board.empNo}</td>
          <th colSpan={1}>조회수</th>
          <td colSpan={1}>{board.boardReadCount}</td>
      </tr>
      <tr>
          <th colSpan={1}>작성일</th>
          <td colSpan={2}>{board.boardWriteDate}</td>
          <th colSpan={1}>수정일</th>
          <td colSpan={2}>{board.boardUpdateDate}</td>
      </tr>
      <tr>
        <td colSpan={6}>
        <textarea
          name="boardContent"
          className="w-100"
          cols="50"
          rows="15"
          value={board.boardContent}
          style={{ border: 'none', boxShadow: 'none',outline: 'none',resize:'none' }}
          onChange={onChange}
        ></textarea>
        </td>
      </tr>
    </table>
    <div className="row">
        <div className="col text-end">
            <button className="btn btn-primary" onClick={updateBoard}>등록</button>
            <button className="btn btn-danger ms-1" onClick={backToDetail}>취소</button>
        </div> 
    </div>

    </div></div>
    );

};
export default BoardUpdate;