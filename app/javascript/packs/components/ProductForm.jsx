import React, { useState } from "react";
import { Button, Form, Input, Modal, Select, DatePicker, message  } from "antd";
import {
    CloseOutlined,
    PlusOutlined,
  } from '@ant-design/icons';
const { Option } = Select;

const ProductForm = (props) => {

    const [visible, setVisible] = useState(false);
    const formRef = React.createRef();
    const path = "/api/v1/products/create"

    const showModal = () => {
        setVisible(true);
    }

    const closeModal = () => {
        setVisible(false);
    }

    const onFinish = (values) => {
        const csrf =  document.querySelector("meta[name='csrf-token']").getAttribute("content");
        const url = path;
        fetch(url, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrf,
            },
            body: JSON.stringify(values),
          })
            .then((data) => {
              if (data.ok) {
                message.success('Product Added Successfully.', 5);
                closeModal();
      
                return data.json();
              }
              throw new Error("Network error.");
            })
            .then(() => {
              props.reloadProducts();
            })
            .catch((err) => message.error("Error: " + err));
    }


    return (
        <>
            <Button type="primary" style={{float: 'right'}} onClick={showModal}><PlusOutlined/> New Product</Button>
            <Modal 
            title="New Product"
            visible={visible}
            onCancel={closeModal}
            footer={null}
            backdrop="static"
            keyboard={false}
            scrollable={true}
            closeIcon={<CloseOutlined />}
            confirmLoading={true}>
                <Form ref={formRef} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="batch_no" label="Batch Number" rules={[{ required: true, message: "Please input batch number!" }]}>
                    <Input placeholder="Batch Number" />
                    </Form.Item>

                    <Form.Item name="name" label="Medicine Name" rules={[{ required: true, message: "Please input medicine name!" }]}>
                    <Input placeholder="Medicine Name" />
                    </Form.Item>

                    <Form.Item
                    name="product_type"
                    label="Medicine Type"
                    rules={[
                        {
                        required: true,
                        message: "Please select a medicine type!",
                        },
                    ]}
                    >
                    <Select showSearch placeholder="Select Medicine Type" optionFilterProp="children" style={{ width: "100%" }}>
                        <Option value="Tablets">Tablets</Option>
                        <Option value="Syrup">Syrup</Option>
                        <Option value="Tube">Tube</Option>
                        <Option value="Injection">Injection</Option>
                    </Select>
                    </Form.Item>

                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please input the quantity!" }]}>
                    <Input type="number" placeholder="Quantity" />
                    </Form.Item>

                    <Form.Item name="unit_price" label="Unit Price" rules={[{ required: true, message: "Please input the unit price!" }]}>
                    <Input addonBefore={"UGX"} type="number" placeholder="Unit Price" />
                    </Form.Item>

                    <Form.Item name="expiry_date" label="Expiry Date" rules={[{ required: true, message: "Please select an expiry date!" }]} >
                        <DatePicker
                        dateRender={current => {
                            const style = {
                                    width: '100%',
                            };
                            if (current.date() === 1) {
                            style.border = '1px solid #1890ff';
                            style.borderRadius = '50%';
                            style.width = '100%';
                            }
                            return (
                            <div className="ant-picker-cell-inner" style={style}>
                                {current.date()}
                            </div>
                            );
                        }}
                        />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ProductForm;