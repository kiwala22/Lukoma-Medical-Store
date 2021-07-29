import { PrinterOutlined } from "@ant-design/icons";
import { Button, Card, message, PageHeader, Table } from "antd";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import Spinner from "./Spinner";

const Sales = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const path = "/api/v1/sales/";

  useEffect(() => loadSales(), []);

  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Sales",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <span>
          {products.map((product) => {
            return (
              <>
                <li
                  key={Math.random().toString(36).substring(5)}
                >{`${product.quantity} x ${product.name}  ${product.amount}`}</li>
                <br />
              </>
            );
          })}
        </span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      responsive: ["md"],
    },
    {
      title: "Sale By",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Date Made",
      dataIndex: "date",
      key: "date",
      render: (date) => <Moment format="D MMM YYYY - HH:mm">{date}</Moment>,
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Button type="primary" ghost onClick={() => generateReceipt(record.id)}>
          <PrinterOutlined />
          Receipt
        </Button>
      ),
      responsive: ["md"],
    },
  ];

  const generateReceipt = (id) => {
    // Method will be used in generated printable receipt
    console.log(`The record ID is ${id}`);
  };

  const loadSales = () => {
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
            products: product.order,
            totalAmount: product.total_amount,
            paymentMethod: product.payment_method,
            date: product.created_at,
            reference: product.reference,
            user: product.username,
          };
          setSales((prevSales) => {
            return [newEl, ...prevSales];
          });
        });
        setIsLoading(false);
      })
      .catch((err) => message.error("Error: " + err), 10);
  };

  const reloadSales = () => {
    setIsLoading(true);
    setSales([]);
    loadSales();
  };

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Sales"
        subTitle="Sales Catalogue"
      />
      {!isLoading && (
        <Card>
          <Table
            className="table-striped-rows"
            dataSource={sales}
            columns={columns}
            pagination={{ pageSize: 25 }}
            scroll={{ x: "100vw" }}
          />
        </Card>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

export default Sales;
