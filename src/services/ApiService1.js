import axios from "axios";
import Cookies from "universal-cookie";
const axiosInstance = axios.create({
  baseURL: '',
});
const cookies = new Cookies();

export const getTenantId = () => {
  return cookies.get('REGISTERED_APPNAME')
}

export const getUserName = () => {
 return  cookies.get('LOGGEDIN_USERID');
}

const apiEndPoint = `http://3a285634dc44.ngrok.io/idcsdemo/api/v1/customer1/`;

export class ApiService {

  static async getData(url, headers, cancelToken, data) {
    const config = {
      headers: {
        ...(headers || {}),
        'Content-Type': 'application/json'
      },
    };
    if (data) {
      config.data = data;
    }
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    const response = await axiosInstance.get(url, config).catch((err) => {
      data = {error: 'something went wrong'};
    });
    return data || response.data;
  }

  static async postMethod(url, data, headers, cancelToken) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    let resData = '';
    const response = await axiosInstance.post(url, data, config).catch(thrown => {
      if (thrown.toString() === 'Cancel') {
        resData = 'cancel';
      } else {
        resData = {error: 'something went wrong'};;
      }
    });
    return resData || response.data;
  }

  static async patchMethod(url, data, headers, cancelToken) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    let resData = '';
    const response = await axiosInstance.patch(url, data, config).catch(thrown => {
      if (thrown.toString() === 'Cancel') {
        resData = 'cancel';
      } else {
        resData = {error: 'something went wrong'};;
      }
    });
    return resData || response.data;
  }

  static async putMethod(url, data, headers) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    let resData = '';
    const response = await axiosInstance.put(url, data, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  async getAllUsers(query) {
    if(query) {
      query = `?${query}`
    } else {
      query = ""
    }
    return await ApiService.getData(`${apiEndPoint}users${query}`);
  }

  async createUser(payload) {
    return await ApiService.postMethod(`${apiEndPoint}users`, payload);
  }

  async getGroups(query) {
    return await ApiService.getData(`${apiEndPoint}groups${query}`);
  }

  async addGroupToUser(payload) {
    return await ApiService.postMethod(`${apiEndPoint}addGroupToUser`, payload);
  }

  async addUserToGroup(payload) {
    return await ApiService.postMethod(`${apiEndPoint}addUserToGroup`, payload);
  }

  async removeGroupFromUser(payload) {
    return await ApiService.postMethod(`${apiEndPoint}removeGroupFromUser`, payload);
  }

  async removeUserFromGroup(payload) {
    return await ApiService.postMethod(`${apiEndPoint}removeUserFromGroup`, payload);
  }

  async getUserGroups(id) {
    return await ApiService.getData(`${apiEndPoint}userGroups/${id}`);
  }

  async getRecentGrants() {
    return await ApiService.getData(`${apiEndPoint}grantreport`);
  }

  async getRecentRevokes() {
    return await ApiService.getData(`${apiEndPoint}revokereport`);
  }
}
