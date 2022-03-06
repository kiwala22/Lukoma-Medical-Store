import { DollarOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, message, PageHeader, Row, Table } from "antd";
import ReactECharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import shortUUID from "short-uuid";
import Requests from "./reusables/Requests";
import Spinner from "./Spinner";

const Dashboard = (props) => {
  const [dates, setDates] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [dailyAmount, setDailyAmount] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0.0);
  const [lowStock, setLowStock] = useState([]);
  const [expiredStock, setExpiredStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadSalesTotals();
  }, []);

  useEffect(() => {
    loadSalesAverages();
  }, []);

  useEffect(() => {
    loadOutOfStock();
  }, []);

  useEffect(() => {
    loadExpiredStock();
  }, []);

  const loadSalesTotals = () => {
    const path = "/api/v1/reports/sale_totals";
    Requests.isGetRequest(path)
      .then((response) => {
        setDates(response.data.labels);
        setAmounts(response.data.totals);
        setIsLoading(false);
      })
      .catch((err) => message.error(err), 10);
  };

  const loadSalesAverages = () => {
    const path = "/api/v1/reports/averages";
    Requests.isGetRequest(path)
      .then((response) => {
        setDailyAmount(response.data.daily);
        setMonthlyAverage(response.data.average);
      })
      .catch((err) => message.error(err), 10);
  };

  const loadOutOfStock = () => {
    const path = "/api/v1/reports/low_stock_products";
    Requests.isGetRequest(path)
      .then((response) => {
        let data = response.data;
        data.forEach((product) => {
          const newEl = {
            key: product,
            name: product.name,
          };
          setLowStock((prevLowStock) => {
            return [newEl, ...prevLowStock];
          });
        });
      })
      .catch((err) => message.error(err), 10);
  };

  const loadExpiredStock = () => {
    const path = "/api/v1/reports/expired_products";
    Requests.isGetRequest(path)
      .then((response) => {
        let data = response.data;
        data.forEach((product) => {
          const newEl = {
            key: product.batch_no,
            batchNo: product.batch_no,
            expiryDate: product.expiry_date,
          };
          setExpiredStock((prevExpiredStock) => {
            return [newEl, ...prevExpiredStock];
          });
        });
      })
      .catch((err) => message.error("Error: " + err), 10);
  };

  const columns = [
    {
      title: "Batch Number",
      dataIndex: "batchNo",
      key: shortUUID.generate(),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: shortUUID.generate(),
      responsive: ["md"],
    },
  ];

  const lowStockColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: shortUUID.generate(),
    },
  ];

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Sale Amounts"],
    },
    grid: { top: 28, right: 8, bottom: 24, left: 50 },
    xAxis: {
      type: "category",
      data: dates,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: amounts,
        type: "line",
        name: "Sale Amounts",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Sales Analytics"
        subTitle="Sales Averages"
      />
      {!isLoading && (
        <>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col
              style={{ marginBottom: 20 }}
              className="gutter-row"
              lg={{ span: 12 }}
              xs={{ span: 24 }}
              // span={12}
            >
              <Card title="Current Total Amount">
                <Card bordered={false} align="center">
                  <div>
                    <Avatar
                      size={80}
                      style={{
                        backgroundColor: "#87d068",
                        fontSize: 32,
                        marginBottom: 10,
                      }}
                      icon={<DollarOutlined />}
                    />
                  </div>
                  <div>
                    <span style={{ color: "darkslategray", fontSize: 25 }}>
                      UGX{" "}
                      {dailyAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </Card>
              </Card>
            </Col>
            <Col
              style={{ marginBottom: 20 }}
              className="gutter-row"
              lg={{ span: 12 }}
              xs={{ span: 24 }}
              // span={12}
            >
              <Card title="Average Monthly Amount">
                <Card bordered={false} align="center">
                  <div>
                    <Avatar
                      size={80}
                      style={{
                        backgroundColor: "#87d068",
                        fontSize: 32,
                        marginBottom: 10,
                      }}
                      icon={<DollarOutlined />}
                    />
                  </div>
                  <div>
                    <span style={{ color: "darkslategray", fontSize: 25 }}>
                      UGX{" "}
                      {monthlyAverage
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </Card>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card title="Monthly Sales Analytics">
                <ReactECharts option={options} />
              </Card>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col
              style={{ marginBottom: 20, marginTop: 20 }}
              className="gutter-row"
              lg={{ span: 12 }}
              xs={{ span: 24 }}
            >
              <Card title="Out of Stock">
                <Table
                  className="table-striped-rows"
                  dataSource={lowStock}
                  columns={lowStockColumns}
                  pagination={{ defaultPageSize: 10 }}
                  key={shortUUID.generate()}
                />
                {/* <Card bordered={false} align="center">
                  <div>
                    <span style={{ color: "darkslategray", fontSize: 15 }}>
                      {lowStock.map((product, index) => (
                        <li key={index}>{product["name"]}</li>
                      ))}
                    </span>
                  </div>
                </Card> */}
              </Card>
            </Col>
            <Col
              style={{ marginBottom: 20, marginTop: 20 }}
              className="gutter-row"
              lg={{ span: 12 }}
              xs={{ span: 24 }}
            >
              <Card title="Expired Products">
                <Table
                  className="table-striped-rows"
                  dataSource={expiredStock}
                  columns={columns}
                  pagination={{ defaultPageSize: 10 }}
                  key={shortUUID.generate()}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

export default Dashboard;
