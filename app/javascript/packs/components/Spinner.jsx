import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

const Spinner = () => {
  return (
    <>
      <div
        style={{
          margin: "20px 0px",
          marginBottom: 20,
          padding: "30px 50px",
          textAlign: "center",
          // background: "rgba(0, 0, 0, 0.05)",
          borderRadius: "4px",
        }}
      >
        <Spin
          indicator={<Loading3QuartersOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      </div>
    </>
  );
};

export default Spinner;
