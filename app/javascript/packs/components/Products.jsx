import React, { useEffect, useState } from "react";
import { Table, message, Popconfirm } from "antd";
import ProductForm from "./ProductForm";

// const { Content } = Layout;

const Products = (props) => {

    const columns = [
        {
            title: "Batch No#",
            dataIndex: "batchNo",
            key: "batch",
        },{
            title: "Name",
            dataIndex: "name",
            key: "name",
        },{
            title: "Product Type",
            dataIndex: "productType",
            key: "product_type",
        },{
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },{
            title: "Unit Price",
            dataIndex: "unitPrice",
            key: "unit_price",
        },{
            title: "Expiry Date",
            dataIndex: "expiryDate",
            key: "expiry_date",
        },
        {
            title: "Actions",
            key: "action",
            render: (_text, record) => (
              <Popconfirm title="Are you sure to delete this medicine?" onConfirm={() => deleteProduct(record.id)} okText="Yes" cancelText="No">
                <a href="#" type="danger">
                  Delete{" "}
                </a>
              </Popconfirm>
            ),
          },
    ];

    const [products, setProducts] = useState([]);

    const path = '/api/v1/products/';

    useEffect(() => { loadProducts() }, []);

    const loadProducts = () => {
        const url = path+'index';
        fetch(url)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw new Error("Network error.");
        })
        .then((data) => {
            data.forEach((product) => {
                const newEl = {
                    key: product.id,
                    id: product.id,
                    batchNo: product.batch_no,
                    name: product.name,
                    productType: product.product_type,
                    quantity: product.quantity,
                    unitPrice: product.unit_price,
                    expiryDate: product.expiry_date,
                };
                setProducts((prevProducts) => {
                    return [newEl, ...prevProducts];
                });
            });
        })
        .catch((err) => message.error("Error: " + err), 10);
    }

    const reloadProducts = () => {
        setProducts([]);
        loadProducts();
    }

    const deleteProduct = (id) => {
        const url = path+`${id}`;

        fetch(url, {
          method: "delete",
        })
        .then((data) => {
        if (data.ok) {
            this.reloadBeers();
            return data.json();
        }
            throw new Error("Network error.");
        })
        .catch((err) => message.error("Error: " + err));
    }

    return (
        <>
            <h1>In Store Medicines</h1>
            <Table className="table-striped-rows" dataSource={products} columns={columns} pagination={{ pageSize: 5 }} />

            <ProductForm reloadProducts={reloadProducts} />
        </>
    );


}

export default Products;

        