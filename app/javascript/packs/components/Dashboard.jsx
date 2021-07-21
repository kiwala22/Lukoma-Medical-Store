import React, { useState } from 'react';
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

const { Header, Sider, Content, Footer } = Layout;

const Dashboard = (props) => {

    console.log(props);

    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => {
        setCollapsed(!collapsed);
    }

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
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}
             style={{
                overflow: 'auto',
                height: '100vh',
                left: 0,
              }}
            >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                    DashBoard
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    Products
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
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: toggle,
                    })}
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 500,
                    }}
                >
                    <p>Welcome, Alick Pro to our Site!</p>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Lukoma Medical Store ©2021 Created by Martin & Paul</Footer>
            </Layout>
        </Layout>
    )
}

export default Dashboard;
