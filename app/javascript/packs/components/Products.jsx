import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import Spinner from "./Spinner";

const Products = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(props.isRefreshing);
  useEffect(() => setIsRefreshing(props.isRefreshing), [props.isRefreshing]);

  const columns = [
    {
      title: "Batch No#",
      dataIndex: "batchNo",
      key: "batch",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Product Type",
      dataIndex: "productType",
      key: "product_type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unit_price",
      responsive: ["md"],
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiry_date",
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "action",
      render: (_text, record) => (
        <Button type="primary" onClick={() => addProductToBasket(record.id)}>
          <PlusCircleOutlined />
          Sale
        </Button>
      ),
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "action",
      render: (_text, record) => (
        <Popconfirm
          title="Are you sure to delete this medicine?"
          onConfirm={() => deleteProduct(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <a href="#" type="danger">
            Delete{" "}
          </a>
        </Popconfirm>
      ),
    },
  ];

  const [products, setProducts] = useState([]);

  const path = "/api/v1/products/";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    // setIsLoading(true);
    const url = path + "index";
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
        setIsLoading(false);
      })
      .catch((err) => message.error("Error: " + err), 10);
  };

  const reloadProducts = () => {
    setIsLoading(true);
    setProducts([]);
    loadProducts();
  };

  if (isRefreshing) {
    reloadProducts();
    setIsRefreshing(!isRefreshing);
  }

  const addProductToBasket = (id) => {
    const csrf = document
      .querySelector("meta[name='csrf-token']")
      .getAttribute("content");
    const url = "/line_items";
    let values = { product_id: id };
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
          message.success("Product Added to Basket.", 2);

          return data.json();
        }
        throw new Error("Network error.");
      })
      .then(() => {
        props.reloadBasket();
      })
      .catch((err) => message.error("Error: " + err));
  };

  const deleteProduct = (id) => {
    const csrf = document
      .querySelector("meta[name='csrf-token']")
      .getAttribute("content");
    const url = path + `${id}`;

    fetch(url, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
    })
      .then((data) => {
        if (data.ok) {
          reloadProducts();
          message.success("Product Removed.");
          return data.json();
        }
        throw new Error("Network error.");
      })
      .catch((err) => message.error("Error: " + err));
  };

  return (
    <>
      <h1>In Store Medicines</h1>
      {!isLoading && (
        <>
          <Table
            className="table-striped-rows"
            dataSource={products}
            columns={columns}
            pagination={{ pageSize: 5 }}
            scroll={{ y: 300, x: "100vw" }}
          />
          <br />
          <ProductForm reloadProducts={reloadProducts} />
        </>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

export default Products;
