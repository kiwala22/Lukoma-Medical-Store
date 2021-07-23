import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Route, Switch, Link } from "react-router-dom";
import axios from 'axios';
import Footing from './Footing';
import Heading from './Heading';
import Products from './Products';
import Dashboard from './Dashboard';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    LogoutOutlined,
    HomeOutlined,
  } from '@ant-design/icons';

const { Sider, Content } = Layout;

const Base = (props) => {

    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };

    const handleLogout = (e) => {
        // e.preventDefault();
        axios.get('/users/sign_out', {
        })
        .then(() => {
            props.history.push("/users/sign_in");
            window.location.reload();
        })
        .catch((error) => {
          console.log(error)
        })

    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to={"/dashboard/"}>
                            DashBoard
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        <Link to={"/products/"}>
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
            <Layout className="site-layout">
                <Heading />
                <Content
                    className="site-layout-background"
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    }}
                >
                    <div
                    style={{
                        paddingTop: 12,
                        paddingBottom: 0,
                        height: '100%',
                        transition: 'margin-right 0.3s ease',
                    }}
                    >
                        <Switch>
                            <Route path='/products/' component={Products} />
                            <Route path={["/", "/dashboard"]} component={Dashboard} />
                        </Switch>
                    </div>
                </Content>
                <Footing />
            </Layout>
        </Layout>
    )
}

export default Base;
