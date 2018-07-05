import React from 'react';
import _ from 'lodash';

const Numbers = (props) => {
  const numberClassName = (number) => {
    if (props.usedNumbers.indexOf(number) >= 0) {
      return 'used';
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    }
  };

  const numberDisabled = (number) => {
    if (props.usedNumbers.indexOf(number) >= 0) {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((number, i) =>
          <span key={i} className={numberClassName(number)}
            onClick={() => props.selectNumber(number)}
            disabled={numberDisabled(number)}>
            {number}
          </span>
        )}
      </div>
    </div>
  );
};

Numbers.list = _.range(1, 10);

export default Numbers;
