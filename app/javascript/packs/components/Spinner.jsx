import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

const Spinner = () => {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          position: "absolute",
          left: "50%",
          top: "50%",
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          size="large"
        />
      </div>
    </>
  );
};

export default Spinner;
