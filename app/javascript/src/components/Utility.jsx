import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
import Requests from "./reusables/Requests";
import Utilities from "./reusables/Utilities";
import Spinner from "./Spinner";
import UtilityForm from "./UtilityForm";

const Utility = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(props.isRefreshing);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [visible, setVisible] = useState(false);
  let searchInput;
  const quantityRef = React.createRef();
  const redQuantityRef = React.createRef();
  //   useEffect(() => setIsRefreshing(props.isRefreshing), [props.isRefreshing]);
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
      title: "Batch Number",
      dataIndex: "batch_number",
      key: "batch",
      ...getColumnSearchProps("batch_number"),
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "name",
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Update",
      key: "action",
      render: (_text, record) => (
        <>
          <Popconfirm
            title={
              <div>
                <Input
                  placeholder="Added Quantity"
                  type="number"
                  ref={quantityRef}
                />
              </div>
            }
            onConfirm={() => {
              updateUtility(record.id, quantityRef.current.input.value);
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button type="primary" ghost>
              <ArrowUpOutlined />
              Add
            </Button>
          </Popconfirm>

          <Popconfirm
            title={
              <div>
                <Input
                  placeholder="Reduced Quantity"
                  type="number"
                  ref={redQuantityRef}
                />
              </div>
            }
            onConfirm={() => {
              updateUtility(record.id, -redQuantityRef.current.input.value);
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button type="primary" ghost style={{ float: "right" }}>
              <ArrowDownOutlined />
              Reduce
            </Button>
          </Popconfirm>
        </>
      ),
      responsive: ["md"],
    },
    {
      title: "Delete",
      key: "action",
      render: (_text, record) => (
        <>
          <Popconfirm
            title="Are you sure to delete this medicine?"
            onConfirm={() => deleteUtility(record.id)}
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

  const [utilities, setUtilities] = useState([]);

  const path = "/api/v1/utilities/";

  useEffect(() => {
    loadUtilities();
  }, []);

  const loadUtilities = () => {
    const url = path + "index";
    Requests.isGetRequest(url)
      .then((response) => {
        if (response.data.status == "Success") {
          let data = response.data.utilities;
          setUtilities(data);
          setIsLoading(false);
        } else {
          message.error("Failed to load. Try Again.", 10);
        }
      })
      .catch((err) => message.error(err), 10);
  };

  const reloadUtilities = () => {
    setIsLoading(true);
    setUtilities([]);
    loadUtilities();
  };

  //   if (isRefreshing) {
  //     reloadProducts();
  //     setIsRefreshing(!isRefreshing);
  //   }

  const updateUtility = (id, quantity) => {
    const url = path + `${id}`;
    let values = { utility_id: id, quantity: quantity };
    Requests.isPostRequest(url, values)
      .then((response) => {
        if (response.data.status == "OK") {
          message.success("Product updated successfully", 2);
          reloadUtilities();
        } else {
          message.error("Failed.", 2);
        }
      })
      .catch((err) => message.error(err, 5));
  };

  const deleteUtility = (id) => {
    const url = path + `${id}`;
    let values = {};
    Requests.isDeleteRequest(url, values)
      .then((response) => {
        if (response.data.status == "OK") {
          reloadUtilities();
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
        title="Utility Store"
        subTitle="Utilities Store"
      />
      {!isLoading && (
        <>
          <Card
            actions={
              visible && [<UtilityForm reloadUtilities={reloadUtilities} />]
            }
          >
            <Table
              className="table-striped-rows"
              dataSource={utilities}
              columns={
                visible
                  ? columns
                  : columns.filter((col) => col.key !== "action")
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

export default Utility;
