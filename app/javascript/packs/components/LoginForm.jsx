import React, { useState, useEffect } from 'react';
import setAxiosHeaders from './AxiosHeaders';
import axios from 'axios';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Ant.css';
import Dashboard from './Dashboard';


const LoginForm = (props) => {
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({}); // To disable submit button at the beginning.

    useEffect(() => {
        forceUpdate({});
    }, []);

    const handleLogin = (e) => {
        setAxiosHeaders();
        axios.post('/users/sign_in', {
        user: {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }
        })
        .then(() => {
            // props.history.push("/");
            window.location.reload();
            const logged = "yes";
            <Dashboard logged={logged} />
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
       <div className="form-div site-card-border-less-wrapper" align="center">
            <Card title="Login" bordered={false} style={{ width: 300 }}>
                <Form form={form} name="normal_login" className="login-form" initialValues={{remember: true,}} onFinish={handleLogin} onSubmit={e => e.preventDefault()}>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" id="email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            id="password"
                        />
                    </Form.Item>
                    <Form.Item shouldUpdate>
                        {() => (
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                disabled={
                                    !form.isFieldsTouched(true) ||
                                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                                }
                            >
                            Log in
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Card>
       </div> 
    );
};

export default LoginForm;
