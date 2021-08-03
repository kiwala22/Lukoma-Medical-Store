import {
  AppstoreOutlined,
  BarChartOutlined,
  CloseOutlined,
  DollarOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  message,
  notification,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Image from "./images/logo.png";
import Products from "./Products";
import Requests from "./reusables/Requests";
import Utilities from "./reusables/Utilities";
import Sales from "./Sales";
const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const Base = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [collapseWidth, setCollapseWidth] = useState("80");
  const [width, setWidth] = useState("200");
  const path = "/basket";
  const key = `open${Date.now()}`;
  const [items, setItems] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const onBreakpoint = (broken) => {
    if (broken) {
      setCollapseWidth("0");
      setWidth("200");
    } else {
      setCollapseWidth("80");
      setWidth("200");
    }
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const close = () => {
    notification.close(key);
  };

  const loadItems = () => {
    const url = path;
    Requests.isGetRequest(url)
      .then((response) => {
        let data = response.data;
        data.forEach((product) => {
          const newEl = {
            key: product.id,
            id: product.id,
            name: product.name,
            amount: product.amount,
            quantity: product.quantity,
          };
          setItems((prevItems) => {
            return [newEl, ...prevItems];
          });
        });
      })
      .catch((err) => message.error(err), 10);
  };

  const reloadBasket = () => {
    setItems([]);
    loadItems();
  };

  const deleteItems = () => {};

  const completeSale = () => {
    const url = "/api/v1/sales/create";
    const values = {};
    Requests.isPostRequest(url, values)
      .then((response) => {
        if (response.data.status == "Success") {
          message.success("Order Processed Successfully", 5);
          clearBasket();
          setIsRefreshing(true);
          setIsRefreshing(false);
        } else if (response.data.status == "Failed") {
          message.error(response.data.error, 10);
        } else {
          message.error("Order Failed. Try Again.", 5);
        }
      })
      .catch((err) => message.error("Error: " + err));
  };

  const clearBasket = () => {
    const url = "/clear_basket";
    let values = {};

    Requests.isDeleteRequest(url, values)
      .then((response) => {
        if (response.data.status == "OK") {
          close();
          reloadBasket();
          message.success("Basket Is now Empty", 1);
        } else {
          message.error("Failed. Try Again", 1);
        }
      })
      .catch((err) => message.error(err), 5);
  };

  const handleLogout = (e) => {
    let path = "/users/sign_out";
    Requests.isGetRequest(path)
      .then(() => {
        props.history.push("/users/sign_in");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openBasket = () => {
    const btn = (
      <Button
        type="primary"
        size="large"
        disabled={!items.length}
        onClick={() => completeSale()}
      >
        Confirm Sale
      </Button>
    );
    notification.open({
      message: (
        <span>
          Sales Basket{" "}
          <span style={{ float: "right" }}>
            <Button
              type="primary"
              size="small"
              disabled={!items.length}
              onClick={() => clearBasket()}
            >
              Clear
            </Button>
          </span>
        </span>
      ),
      description: (
        <>
          <Table
            dataSource={items}
            columns={columns}
            pagination={false}
            summary={(pageData) => {
              let totalAmount = 0;
              pageData.forEach(({ amount }) => {
                totalAmount += parseFloat(amount);
              });

              if (Array.isArray(pageData) && pageData.length) {
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text style={{ fontSize: 18 }}>Total</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text
                          type="danger"
                          style={{ float: "right", fontSize: 18 }}
                        >
                          UGX{" "}
                          {totalAmount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }
            }}
          />
        </>
      ),
      closeIcon: <CloseOutlined />,
      duration: 0,
      btn,
      key,
    });
  };

  return (
    <Layout>
      <Header
        className="header"
        style={{
          position: "fixed",
          zIndex: 2,
          width: "100%",
          padding: "0 50px",
        }}
      >
        <div className="logo">
          <span style={{ color: "#fff", fontSize: 20 }}>
            <img src={Image} />
            Med Store
          </span>
          <span style={{ float: "right", paddingRight: 10 }}>
            <Button type="primary" ghost onClick={openBasket}>
              <ShoppingCartOutlined />
              Basket
            </Button>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          breakpoint="xs"
          collapsedWidth={collapseWidth}
          width={width}
          onBreakpoint={(broken) => {
            onBreakpoint(broken);
          }}
          className="site-layout-background"
          zeroWidthTriggerStyle={{ marginTop: 35 }}
          style={{
            left: 0,
            zIndex: 1000,
            top: 60,
            position: "fixed",
            display: "block",
            bottom: 0,
            borderRight: 0,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[props.location.pathname]}
          >
            <Menu.Item key="/" icon={<BarChartOutlined />}>
              <Link to={"/"}>DashBoard</Link>
            </Menu.Item>
            <Menu.Item key="/products/" icon={<AppstoreOutlined />}>
              <Link to={"/products/"}>Products</Link>
            </Menu.Item>
            <Menu.Item key="/sales/" icon={<DollarOutlined />}>
              <Link to={"/sales/"}>Sales</Link>
            </Menu.Item>
          </Menu>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[""]}
            onClick={handleLogout}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Menu.Item key="1" icon={<LogoutOutlined />}>
              Sign Out
            </Menu.Item>
          </Menu>
        </Sider>
        <Content
          style={{
            marginLeft: collapsed
              ? Utilities.isMobile()
                ? 10
                : 90
              : Utilities.isMobile()
              ? 10
              : 210,
            marginRight: Utilities.isMobile() && 10,
            overflowX: "hidden",
            marginTop: Utilities.isMobile() ? 50 : 70,
          }}
        >
          <div
            style={{
              paddingTop: 12,
              paddingBottom: 0,
              height: "100%",
              marginRight: 0,
              // overflowY: "scroll",
              transition: "margin-right 0.3s ease",
            }}
          >
            <Switch>
              <Route
                path="/products/"
                render={(props) => (
                  <Products
                    {...props}
                    reloadBasket={reloadBasket}
                    isRefreshing={isRefreshing}
                  />
                )}
              />
              <Route path="/sales/" component={Sales} />
              <Route path={["/"]} component={Dashboard} />
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Base;
