import { PrinterOutlined } from "@ant-design/icons";
import { Button, Card, message, PageHeader, Table } from "antd";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import Receipt from "./Receipt";
import Utilities from "./reusables/Utilities";
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
          {products.map((product, index) => {
            return (
              <span key={index}>
                <li>{`${product.quantity} x ${product.name}  ${product.amount}`}</li>
                <br />
              </span>
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
        <Receipt data={record}>
          <Button type="primary" ghost>
            <PrinterOutlined />
            Receipt
          </Button>
        </Receipt>
      ),
      responsive: ["md"],
    },
  ];

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
            scroll={Utilities.isMobile() && { x: "100vw" }}
          />
        </Card>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

export default Sales;
