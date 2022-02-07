import axios from "axios";
import setHeaders from "./Headers";

export default {
  isGetRequest(path) {
    return axios.get(path, {});
  },
  isPostRequest(path, variables) {
    return axios.post(path, variables, { headers: setHeaders() });
  },
  isDeleteRequest(path, variables) {
    return axios.delete(path, variables, { headers: setHeaders() });
  },
};
