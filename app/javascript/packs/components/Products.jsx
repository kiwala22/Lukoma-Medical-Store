import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import ProductForm from "./ProductForm";
import Spinner from "./Spinner";

const Products = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(props.isRefreshing);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  useEffect(() => setIsRefreshing(props.isRefreshing), [props.isRefreshing]);

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
            let searchInput = node;
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
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
      dataIndex: "batchNo",
      key: "batch",
      ...getColumnSearchProps("batchNo"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
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
