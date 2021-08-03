import { PrinterOutlined } from "@ant-design/icons";
import { Button, Card, message, PageHeader, Table } from "antd";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import Receipt from "./Receipt";
import FormatOrders from "./reusables/FormatOrders";
import Requests from "./reusables/Requests";
import Utilities from "./reusables/Utilities";
import Spinner from "./Spinner";

const Sales = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const path = "/api/v1/sales/";

  useEffect(() => loadSales(), []);

  const mergeCells = (value, row) => {
    return {
      children: value,
      props: {
        rowSpan: row.rowSpan,
      },
    };
  };

  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: mergeCells,
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount @",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "totalAmount",
      render: mergeCells,
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "paymentMethod",
      render: mergeCells,
      responsive: ["md"],
    },
    {
      title: "Sale By",
      dataIndex: "username",
      key: "user",
      render: mergeCells,
    },
    {
      title: "Date Made",
      dataIndex: "created_at",
      key: "date",
      render: (date, row) => {
        return {
          children: <Moment format="D MMM YYYY - HH:mm">{date}</Moment>,
          props: { rowSpan: row.rowSpan },
        };
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (record, row) => {
        return {
          children: (
            <Receipt data={row}>
              <Button type="primary" ghost>
                <PrinterOutlined />
                Receipt
              </Button>
            </Receipt>
          ),
          props: { rowSpan: row.rowSpan },
        };
      },
      responsive: ["md"],
    },
  ];

  const loadSales = () => {
    const url = path + "index";
    Requests.isGetRequest(url)
      .then((response) => {
        if (response.data.status == "Success") {
          let data = FormatOrders.formatOrderData(response.data.sales);
          setSales(data);
          setIsLoading(false);
        } else {
          message.error("Failed to load. Try Again.", 5);
        }
      })
      .catch((err) => message.error(err), 10);
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
            dataSource={FormatOrders.mergeOrderData(sales)}
            columns={columns}
            pagination={{ pageSize: 25 }}
            scroll={Utilities.isMobile() && { x: "100vw" }}
            bordered
          />
        </Card>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

export default Sales;
