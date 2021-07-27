import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import setAxiosHeaders from "./AxiosHeaders";

const LoginForm = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const userLoginSuccess = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/check_user", {})
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
    setAxiosHeaders();
    axios
      .post("/users/sign_in", {
        user: values,
      })
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
        message.error("Invalid Email or Password Combination", 5);
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
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
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
                className="login-form-button"
                // onClick={onClickBtn}
                loading={loading}
                // disabled={
                //     !form.isFieldsTouched(true) ||
                //     !!form.getFieldsError().filter(({ errors }) => errors.length).length
                // }
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
