import axios from "axios";

const UseAxios = async (method, url, data = {}, headers = {}) => {
  const response = await axios({
    method,
    url: `${url}`,
    data,
    headers,
  });

  return response.data;
};

export default UseAxios;