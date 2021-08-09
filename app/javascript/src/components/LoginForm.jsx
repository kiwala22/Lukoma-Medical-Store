import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import React, { useState } from "react";
import Requests from "./reusables/Requests";

const LoginForm = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const userLoginSuccess = () => {
    let path = "/api/v1/check_user";
    return new Promise((resolve, reject) => {
      Requests.isGetRequest(path)
        .then((response) => {
          if (response.data.email) {
            resolve(response.data.email);
          } else {
            reject(new Error("Failed"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleLogin = (values) => {
    setLoading(true);
    let path = "/users/sign_in";
    let variables = { user: values };
    Requests.isPostRequest(path, variables)
      .then(async () => {
        await userLoginSuccess();
        message.success("Login Successful", 8);
        setLoading(false);
        setTimeout(() => {
          props.history.push("/");
          window.location.reload();
        }, 2000);
      })
      .catch(() => {
        message.error("Invalid Username or Password Combination", 5);
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <Card title="Log in to your account" style={{ width: 350 }}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          onSubmit={(e) => e.preventDefault()}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                block
                className="login-form-button"
                loading={loading}
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
