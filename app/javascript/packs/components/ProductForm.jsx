import { CloseOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import React, { useState } from "react";
import Requests from "./reusables/Requests";
const { Option } = Select;

const ProductForm = (props) => {
  const [visible, setVisible] = useState(false);
  const formRef = React.createRef();
  const path = "/api/v1/products/create";

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
          props.reloadProducts();
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
        <PlusCircleOutlined /> New Product
      </Button>
      <Modal
        title="New Product"
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
            name="batch_no"
            label="Batch Number"
            rules={[{ required: true, message: "Please input batch number!" }]}
          >
            <Input placeholder="Batch Number" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item
            name="product_type"
            label="Product Category"
            rules={[
              {
                required: true,
                message: "Please select a product category!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select Product Category"
              optionFilterProp="children"
              style={{ width: "100%" }}
            >
              <Option value="Tablets">Tablets</Option>
              <Option value="Capsules">Capsules</Option>
              <Option value="Syrup">Syrup</Option>
              <Option value="Tube">Tube</Option>
              <Option value="Injection">Injection</Option>
              <Option value="Solution">Solution</Option>
              <Option value="Powder">Powder</Option>
              <Option value="Aerosol">Aerosol</Option>
              <Option value="Suppositories">Suppositories</Option>
              <Option value="Syringe">Syringe</Option>
              <Option value="Needs">Needs</Option>
              <Option value="Others">Others</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input type="number" placeholder="Quantity" />
          </Form.Item>

          <Form.Item
            name="unit_price"
            label="Unit Price"
            rules={[
              { required: true, message: "Please input the unit price!" },
            ]}
          >
            <Input prefix={"UGX"} type="number" placeholder="Unit Price" />
          </Form.Item>

          <Form.Item
            name="expiry_date"
            label="Expiry Date"
            // rules={[
            //   { required: true, message: "Please select an expiry date!" },
            // ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              dateRender={(current) => {
                return (
                  <div className="ant-picker-cell-inner">{current.date()}</div>
                );
              }}
            />
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

export default ProductForm;
