import shortUuid from "short-uuid";

export default {
  formatOrderData(data) {
    let output = [];
    data.forEach((sale) => {
      sale.order.forEach((order) => {
        let saleData = {
          ...order,
          ...sale,
          ...{ key: shortUuid.generate() },
        };
        output.push(saleData);
      });
    });
    return output;
  },

  mergeOrderData(data) {
    //Merge array cells
    return data
      .reduce((result, item) => {
        //First, take the reference field as a new array result
        if (result.indexOf(item.reference) < 0) {
          result.push(item.reference);
        }
        return result;
      }, [])
      .reduce((result, reference) => {
        //Take the data with the same reference as a new array, and add a new field * * rowSpan inside it**
        const children = data.filter((item) => item.reference === reference);
        result = result.concat(
          children.map((item, index) => ({
            ...item,
            rowSpan: index === 0 ? children.length : 0, //Add the first row of data to the rowSpan field
          }))
        );
        return result;
      }, []);
  },
};
