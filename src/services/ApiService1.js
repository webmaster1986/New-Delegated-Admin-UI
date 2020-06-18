import axios from "axios";
import Cookies from "universal-cookie";
const apiEndPoint = 'http://a06861fc2e00.ngrok.io/idcsdemo/api';
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

  async getAllUsers() {
    return await ApiService.getData(`${apiEndPoint}/v1/users`);
  }

  async createUser(payload) {
    return await ApiService.postMethod(`${apiEndPoint}/v1/users`, payload);
  }

  async getGroups(query) {
    return await ApiService.getData(`${apiEndPoint}/v1/groups${query}`);
  }

  async addGroupToUser(payload) {
    return await ApiService.postMethod(`${apiEndPoint}/v1/addGroupToUser`, payload);
  }

  async addUserToGroup(payload) {
    return await ApiService.postMethod(`${apiEndPoint}/v1/addUserToGroup`, payload);
  }

  async removeGroupFromUser(payload) {
    return await ApiService.postMethod(`${apiEndPoint}/v1/removeGroupFromUser`, payload);
  }

  async removeUserFromGroup(payload) {
    return await ApiService.postMethod(`${apiEndPoint}/v1/removeUserFromGroup`, payload);
  }

  async getUserGroups(id) {
    return await ApiService.getData(`${apiEndPoint}/v1/userGroups/${id}`);
  }
}
