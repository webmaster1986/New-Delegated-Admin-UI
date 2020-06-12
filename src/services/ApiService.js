import axios from "axios";
import Cookies from "universal-cookie";
import { body } from "./campaignUserBody";
const apiEndPoint = 'http://cloud.kapstonellc.com:8084';
const oktaEndPoint = 'http://cloud.kapstonellc.com:8085';
const apiServiceEndPoint = 'https://preview.kapstonellc.com';
const requestAPIServiceEndPoint = 'https://preview.kapstonellc.com';
const axiosInstance = axios.create({
  baseURL: '',
});
const cookies = new Cookies();

export const getTenantId = () =>{
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

  async getRequests(payload) {
    return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/tasks`, payload);
  }

  async getCertificateUsers(certificationId) {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getCertificateUsers/${certificationId}`);
  }

  async getUserDetails(userName, campaignID) {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getUserDetails/${getUserName()}/${userName}/${campaignID}`);
  }

  static async submitRequestAction(data) {
    const config = {
    };
    return await axiosInstance.post(`${requestAPIServiceEndPoint}/workflowv1/review`, data, config)
  }

  static async certificationAction(data) {
    return await ApiService.patchMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/action`, data);
  }

  static async registration (tenantId, applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${tenantId}/loginconfig/${applicationType}`, data);
  }

  static async bulkAction(data) {
    return await ApiService.patchMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/bulkAction`, data);
  }

  static async getConfigForClient(data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/RequestJWTToken/jersey/TokenProvider/applicationType`, data);
  }

  static async localLogin(data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/RequestJWTToken/jersey/TokenProvider/requestToken`, data);
  }

  static async verifyToken(data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/RequestJWTToken/jersey/TokenProvider/verifyToken`, data);
  }

  static async uploadXLSAuthcontroller(certificationId,  campaignId, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/submitOfflineCertification/${getUserName()}/${campaignId}/${certificationId}`, data);
  }

  async generateTenantID() {
    return await ApiService.getData(`${apiServiceEndPoint}/authcontroller/NEW/generateTenantID`);
  }

  static async GetAllIdentityUsers(page) {
    return await ApiService.getData(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/getAllUser?startIndex=${(page -1) * 25}&limit=25 `);
  }

  static async getUsersWorkflow(payload) {
    return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/getusers`, payload);
  }

  static async getOfflineCertificationDetails(certificationId) {
    return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getOfflineCertificationDetails/${certificationId}`);
  }

  static async getRequestsTasks(payload) {
    return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/tasks`, payload);
  }

  static async getCertificationsList() {
    return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getCertifications/${getUserName()}`);
  }
}
