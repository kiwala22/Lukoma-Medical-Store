import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  message,
  PageHeader,
  Popconfirm,
  Space,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import shortUUID from "short-uuid";
import ProductForm from "./ProductForm";
import Requests from "./reusables/Requests";
import Utilities from "./reusables/Utilities";
import Spinner from "./Spinner";

const Products = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(props.isRefreshing);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [visible, setVisible] = useState(false);
  let searchInput;
  const quantityRef = React.createRef();
  useEffect(() => setIsRefreshing(props.isRefreshing), [props.isRefreshing]);
  useEffect(() => {
    checkAbility();
  }, []);

  const checkAbility = () => {
    const path = "/api/v1/check_ability";
    Requests.isGetRequest(path)
      .then((response) => {
        if (response.data.status == "Authorized") {
          setVisible(true);
        } else {
          setVisible(false);
        }
      })
      .catch((err) => message.error(err), 10);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Batch No#",
      dataIndex: "batch_no",
      key: "batch",
      ...getColumnSearchProps("batch_no"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Product Category",
      dataIndex: "product_type",
      key: "product_type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      responsive: ["md"],
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      responsive: ["md"],
    },
    {
      title: "Sale",
      key: "action",
      render: (_text, record) => (
        <>
          <Popconfirm
            title={
              <div>
                <Input
                  placeholder="Enter desired Quantity"
                  type="number"
                  ref={quantityRef}
                />
              </div>
            }
            onConfirm={() => {
              addProductToBasket(record.id, quantityRef.current.input.value);
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button type="primary" ghost>
              <PlusCircleOutlined />
              Sale
            </Button>
          </Popconfirm>
        </>
      ),
      responsive: ["md"],
    },
    {
      title: "Delete",
      key: "delete",
      render: (_text, record) => (
        <>
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
        </>
      ),
      responsive: ["md"],
    },
  ];

  const [products, setProducts] = useState([]);

  const path = "/api/v1/products/";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const url = path + "index";
    Requests.isGetRequest(url)
      .then((response) => {
        if (response.data.status == "Success") {
          let data = response.data.products;
          setProducts(data);
          setIsLoading(false);
        } else {
          message.error("Failed to load. Try Again.", 10);
        }
      })
      .catch((err) => message.error(err), 10);
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

  const addProductToBasket = (id, quantity) => {
    quantityRef.current.input.value = null;
    const url = "/line_items";
    let values = { product_id: id, quantity: quantity };
    Requests.isPostRequest(url, values)
      .then((response) => {
        if (response.data.status == "Success") {
          message.success("Product Added to Basket.", 2);
          props.reloadBasket();
        } else {
          message.error(response.data.status, 2);
        }
      })
      .catch((err) => message.error(err, 5));
  };

  const deleteProduct = (id) => {
    const url = path + `${id}`;
    let values = {};
    Requests.isDeleteRequest(url, values)
      .then((response) => {
        if (response.data.status == "OK") {
          reloadProducts();
          message.success("Product Removed.", 2);
        } else {
          message.error("Failed. Try Again.", 2);
        }
      })
      .catch((err) => message.error(err), 5);
  };

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Store"
        subTitle="Medicines Store"
      />
      {!isLoading && (
        <>
          <Card
            actions={
              visible && [<ProductForm reloadProducts={reloadProducts} />]
            }
          >
            <Table
              className="table-striped-rows"
              dataSource={products}
              columns={
                visible
                  ? columns
                  : columns.filter((col) => col.key !== "delete")
              }
              pagination={{ pageSize: 25 }}
              scroll={Utilities.isMobile() && { x: "100vw" }}
              bordered
              rowKey={() => {
                return shortUUID.generate();
              }}
              size="small"
            />
          </Card>
        </>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

export default Products;
