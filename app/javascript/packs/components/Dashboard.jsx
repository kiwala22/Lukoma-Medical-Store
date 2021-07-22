import React from 'react';
import { Layout } from 'antd';
import Footing from './Footing';
import SideBar from './SideBar';
import Heading from './Heading';

const { Content } = Layout;

const Dashboard = () => {

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideBar  />
            <Layout className="site-layout">
                <Heading />
                <Content
                    className="site-layout-background"
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    }}
                >
                    <h1>Analytics Page</h1>
                </Content>
                <Footing />
            </Layout>
        </Layout>
    )
}

export default Dashboard;
