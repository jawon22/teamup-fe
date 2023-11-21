import React from 'react';
import { useRecoilState } from 'recoil';
import { companyState, userState } from '../recoil';

const BoardOne = ({ idx, writer, title, contents }) => {

    const [user, setUser] = useRecoilState(userState);
    const empNo = user.substring(6)
    const deptNo = user.substring(4, 6);
    const [comId] = useRecoilState(companyState);

  return (
    <div>
      <h2>{title}</h2>
      <h5>{writer}</h5>
      <hr />
      <p>{contents}</p>
    </div>
  );
};

export default BoardOne;