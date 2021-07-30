import { PrinterOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Typography } from "antd";
import React, { Component } from "react";
import Moment from "react-moment";
import ReactToPrint from "react-to-print";
const { Text } = Typography;

class Receipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isLoading: false,
      apiData: undefined,
    };
    this.printableEl = React.createRef();
  }

  render() {
    return (
      <>
        {React.cloneElement(this.props.children, {
          onClick: () => {
            this.setState({ isVisible: true });
          },
        })}
        <Modal
          title={"RECEIPT"}
          visible={this.state.isVisible}
          onCancel={() => {
            this.setState({
              isVisible: false,
            });
          }}
          keyboard={false}
          maskClosable={false}
          maskStyle={{ background: "#1890ff" }}
          width={"100mm"}
          footer={
            <ReactToPrint
              trigger={() => {
                return (
                  <Button type="primary">
                    <PrinterOutlined /> PRINT
                  </Button>
                );
              }}
              content={() => this.printableEl.current}
              onAfterPrint={() => {
                this.setState({ isVisible: false });
              }}
            />
          }
        >
          <div id="receipt" ref={this.printableEl} style={{ margin: "10px" }}>
            <Text strong>LUKOMA MEDICAL CLINIC. LTD</Text>
            <Text style={{ display: "block" }}>Medical Store Group</Text>
            <Text style={{ display: "block" }}>P.O BOX 447, KAMPALA</Text>
            <Text style={{ display: "block" }}>TEL: +256 757 032 427</Text>
            <Text style={{ display: "block" }}>
              Email: enochbogere88@gmail.com
            </Text>
            <Text
              style={{
                display: "block",
                marginTop: "5px",
                marginBottom: "5px",
              }}
              strong
            >
              RECEIPT
            </Text>
            <Text style={{ display: "block" }}>
              Payment Ref: <Text strong>{this.props.data.reference}</Text>
            </Text>
            <Text style={{ display: "block" }}>
              Payment Method:{" "}
              <Text strong>{this.props.data.paymentMethod}</Text>
            </Text>
            <Text style={{ display: "block" }}>
              Purchase Date:{" "}
              <Text strong>
                <Moment format="D MMM YYYY - HH:mm">
                  {this.props.data.date}
                </Moment>
              </Text>
            </Text>
            <Table
              style={{ marginTop: "10px" }}
              pagination={false}
              size="small"
              rowKey="bill"
              dataSource={this.props.data.products}
              columns={[
                {
                  title: "PDT",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "QTY",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "AMOUNT",
                  dataIndex: "amount",
                  key: "amount",
                },
              ]}
              bordered={false}
            />
            <Text style={{ display: "block", marginTop: "15px" }}>
              Total Amount: <Text strong>{this.props.data.totalAmount}</Text>
            </Text>
            <Text style={{ display: "block", marginTop: "15px" }}>
              Served by: <Text strong>{this.props.data.user}</Text>
            </Text>
          </div>
        </Modal>
      </>
    );
  }
}

export default Receipt;
