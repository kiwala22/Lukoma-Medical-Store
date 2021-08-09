import { CloseOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select } from "antd";
import React, { useState } from "react";
import Requests from "./reusables/Requests";
const { Option } = Select;

const UtilityForm = (props) => {
  const [visible, setVisible] = useState(false);
  const formRef = React.createRef();
  const path = "/api/v1/utilities/create";

  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    Requests.isPostRequest(path, values)
      .then((response) => {
        if (response.data.status == "Success") {
          message.success("Product Added Successfully.", 5);
          closeModal();
          props.reloadUtilities();
        } else {
          let error = response.data.errors[1][0];
          message.error(error, 5);
        }
      })
      .catch((err) => {
        message.error(err, 5);
      });
  };

  return (
    <>
      <Button
        type="primary"
        ghost
        style={{ float: "right", paddingRight: 10 }}
        onClick={showModal}
      >
        <PlusCircleOutlined /> New Utility
      </Button>
      <Modal
        title="New Utility"
        visible={visible}
        onCancel={closeModal}
        footer={null}
        backdrop="static"
        keyboard={false}
        scrollable={true}
        closeIcon={<CloseOutlined />}
        confirmLoading={true}
        maskClosable={false}
      >
        <Form ref={formRef} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="batch_number"
            label="Batch Number"
            // rules={[{ required: true, message: "Please input batch number!" }]}
          >
            <Input placeholder="Batch Number" />
          </Form.Item>

          <Form.Item
            name="product_name"
            label="Product Name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input type="number" placeholder="Quantity" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ float: "right" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UtilityForm;
