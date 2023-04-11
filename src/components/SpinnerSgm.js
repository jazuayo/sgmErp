import { css } from "@emotion/react";
import React from "react";
import DotLoader from "react-spinners/DotLoader";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: #117A65;
`;


export default function SpinnerSgm(props) {
    const {
        loading,
        size,
        ...rest
    } = props;
    let sizeSpiner = 50;
    if (size) {
        sizeSpiner = size;
    }
    return (
        <div className="sweet-loading">
            <DotLoader
                css={override}
                size={sizeSpiner}
                color={"#117A65 "}
                loading={loading}
            />
        </div>
    );
}
