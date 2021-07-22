import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const SideBar = (props) => {
    console.log(props)

    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };

    const handleLogout = (e) => {
        // e.preventDefault();
        axios.get('/users/sign_out', {
        })
        .then(() => {
            // props.history.push("/users/sign_in");
            window.location.reload();
        })
        .catch((error) => {
          console.log(error)
        })

    }

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} >
           <div className="logo" />
           <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
               <Menu.Item key="1" icon={<HomeOutlined />}>
                   <Link to={"/"}>
                    DashBoard
                   </Link>
               </Menu.Item>
               <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                   <Link to={"/products"}>
                       Products
                   </Link>
               </Menu.Item>
               <Menu.Item key="3" icon={<UploadOutlined />}>
               Sales
               </Menu.Item>
               
           </Menu>
           <Menu theme="dark" mode="inline" defaultSelectedKeys={['']} onClick={handleLogout} onSubmit={(e) => {e.preventDefault()}}>
               <Menu.Item key="1" icon={<LogoutOutlined />}>
                   Sign Out
               </Menu.Item>
           </Menu>
       </Sider>
    );

}

export default SideBar;