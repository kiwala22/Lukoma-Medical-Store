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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Sales from "./Sales";

const { Sider, Content, Header, Footer } = Layout;
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
      setWidth("80");
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
            name: product.name,
            amount: product.amount,
            quantity: product.quantity,
          };
          setItems((prevItems) => {
            return [newEl, ...prevItems];
          });
        });
      })
      .catch((err) => message.error("Error: " + err), 10);
  };

  const reloadBasket = () => {
    setItems([]);
    loadItems();
  };

  const deleteItems = () => {};

  const completeSale = () => {
    const csrf = document
      .querySelector("meta[name='csrf-token']")
      .getAttribute("content");
    const url = "/api/v1/sales/create";
    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
    })
      .then((data) => {
        if (data.ok) {
          message.success("Order Processed Successfully", 5);

          return data.json();
        }
        throw new Error("Network error.");
      })
      .then(() => {
        clearBasket();
        setIsRefreshing(true);
        setIsRefreshing(false);
      })
      .catch((err) => message.error("Error: " + err));
  };

  const clearBasket = () => {
    const csrf = document
      .querySelector("meta[name='csrf-token']")
      .getAttribute("content");
    const url = "/clear_basket";

    fetch(url, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
    })
      .then((data) => {
        if (data.ok) {
          close();
          reloadBasket();
          message.success("Basket Is now Empty", 3);
          return data.json();
        }
        throw new Error("Network error.");
      })
      .catch((err) => message.error("Error: " + err));
  };

  const handleLogout = (e) => {
    // e.preventDefault();
    axios
      .get("/users/sign_out", {})
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
    <Layout style={{ minHeight: "100vh" }}>
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
        zeroWidthTriggerStyle={{ marginTop: 35 }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<BarChartOutlined />}>
            <Link to={"/"}>DashBoard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />}>
            <Link to={"/products/"}>Products</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<DollarOutlined />}>
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
      <Layout className="site-layout">
        <Header className="site-layout-background-head" style={{ padding: 0 }}>
          <span style={{ float: "right", paddingRight: 10 }}>
            <Button type="primary" ghost onClick={openBasket}>
              <ShoppingCartOutlined />
              Basket
            </Button>
          </span>
        </Header>
        <Content
          className="site-layout-background"
          style={{ margin: "24px 16px 0", overflow: "initial", padding: 24 }}
        >
          <div
            style={{
              paddingTop: 12,
              paddingBottom: 0,
              height: "100%",
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
        <Footer style={{ textAlign: "center", fontSize: 18 }}>
          Lukoma Medical Store ©2021
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Base;
