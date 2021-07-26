import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import {
    LoadingOutlined,
  } from '@ant-design/icons';


const Spinner = () => {
    return (
        <>
            <div style={{textAlign: "center", position: 'absolute', left: '50%', top: '50%', }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} size="large" />
            </div> 
        </>
    )
}

export default Spinner;