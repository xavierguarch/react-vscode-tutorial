import React from 'react';

const RedrawButton = (props) => {
    return (
        <div className="col-12 text-center">
            < button className="btn"
                onClick={props.handleOnClick}
                disabled={props.redrawsLeft === 0}>
                <i className="fa fa-refresh"> {props.redrawsLeft}</i>
            </button >
        </div >
    );
};

export default RedrawButton;
