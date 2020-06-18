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

  static async deleteMethod(url, data, headers) {
    const config = {
      headers: {
        ...(headers || {})
      },
      data
    };
    let resData = '';
    const response = await axiosInstance.delete(url, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  async getReviewAndApproveData(requestId, orgId, startDate, endDate) {
      return await ApiService.getData(`${apiEndPoint}/userDetailsbyParameters?requestId=${requestId}&orgId=${orgId}&startDate=${startDate || ''}&endDate=${endDate || ''}`);
  }

  async getAllUsers() {
      return await ApiService.getData(`${oktaEndPoint}/OKTAAppServices/OKTA/getAllUsers`);
  }

  async getAllApplications() {
      return await ApiService.getData(`${oktaEndPoint}/OKTAAppServices/OKTA/getAllApplications`);
  }

  async getCampaigns() {
      return await ApiService.getData(`${apiServiceEndPoint}/campaign/${getTenantId()}/getCampaigns`);
  }

  async getCampaignsAppList() {
    return await ApiService.getData(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/initialLoadDetails`);
  }

  async getDirectSources() {
      return await ApiService.getData(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/getIdentityConfig`);
  }
  async getCertifications() {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getCertifications/${getUserName()}`);
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

  async getSMTP() {
      return await ApiService.getData(`${apiServiceEndPoint}/notification/jersey/email/getsmtp/${getTenantId()}`);
  }

  async getAllTemplates() {
      return await ApiService.getData(`${apiServiceEndPoint}/notification/jersey/email/getalltemplates/${getTenantId()}`);
  }

  static async putReviewAndApproveData(data) {
      return await ApiService.postMethod(`${apiEndPoint}/createMultipleUserDetails`, data);
  }

  static async createCampaign(data) {
      return await ApiService.postMethod(`${apiServiceEndPoint}/campaign/${getTenantId()}/createCampaign`, data);
  }

  static async submitRequestAction(data) {
    const config = {
    };
    return await axiosInstance.post(`${requestAPIServiceEndPoint}/workflowv1/review`, data, config)
  }

  static async createCampaignUsers(campaignid) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/campaign/${getTenantId()}/getUsers/${campaignid}`, body);
  }

  static async createEmailStoreSMTP(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/notification/jersey/email/storesmtp/${getTenantId()}`, payload);
  }

  static async createEmailStoreTemplate(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/notification/jersey/email/storetemplate/${getTenantId()}`, payload);
  }

  static async certificationAction(data) {
    return await ApiService.patchMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/action`, data);
  }

  static async ownerCertificationEntitlementsAction(data) {
    return await ApiService.patchMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/groupaction`, data);
  }

  static async registration (tenantId, applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${tenantId}/loginconfig/${applicationType}`, data);
  }

  static async getAllEntities() {
    return await ApiService.getData(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/getAllCatalogItems`);
  }

  static async postEntity(body) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/modifyCatalogItems`, body);
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

  static async directAuthcontroller(applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/identityconfig/${applicationType}`, data);
  }

  static async updateDirectAuthcontroller(applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/updateIdentityconfig/${applicationType}`, data);
  }

  static async uploadcsvAuthcontroller(applicationType, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/authcontroller/${getTenantId()}/uploadcsv/${applicationType}`, data);
  }

  static async uploadXLSAuthcontroller(certificationId,  campaignId, data) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/submitOfflineCertification/${getUserName()}/${campaignId}/${certificationId}`, data);
  }


  async generateTenantID() {
    return await ApiService.getData(`${apiServiceEndPoint}/authcontroller/NEW/generateTenantID`);
  }

  static async LoadCSVScheduler() {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/start?jobName=${getTenantId()}_FLATFILE_TrustedRecon`);
  }

  static async LoadEnrichmentScheduler() {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/start?jobName=${getTenantId()}_ENRICHMENT_TrustedRecon`);
  }

  static async LoadDirectScheduler(jobName) {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/start?jobName=${jobName}_TrustedRecon`);
  }

  static async GetAllIdentityUsers(page) {
    return await ApiService.getData(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/getAllUser?startIndex=${(page -1) * 25}&limit=25 `);
  }

  static async GetScheduledJobs() {
    return await ApiService.getData(`${apiServiceEndPoint}/scheduler/scheduler/jobs`);
  }

  static async getUsersWorkflow(payload) {
    return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/getusers`, payload);
  }
  static async getgroupsWorkflow(payload) {
    return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/getgroups`, payload);
  }

  static async getappsWorkflow(payload) {
    return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/getapps`, payload);
  }

  static async getRequestsTasks(payload) {
    return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/tasks`, payload);
  }

    static async deleteTask(payload) {
        return await ApiService.postMethod(`${requestAPIServiceEndPoint}/workflowv1/delete`, payload);
    }

  static async newApp(payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/registerApplication/jersey/register/newApp`, payload);
  }

  static async getAppDetails(appId, payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/registerApplication/jersey/register/getApp/${appId}`, payload);
  }

  static async regenerateToken(appId, payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/registerApplication/jersey/register/regenerateToken/${appId}`, payload);
  }
  static async schemaMapper(appId, payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/registerApplication/jersey/schemamapper/mapfields/${appId}`, payload);
  }

  static async regenerateClientSecret(appId, payload) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/registerApplication/jersey/register/regenerateClientSecret/${appId}`, payload);
  }

  static async updateApp(appId, payload) {
    return await ApiService.putMethod(`${apiServiceEndPoint}/registerApplication/jersey/register/updateApp/${appId}`, payload);
  }

  static async getMappedSchema(appId) {
    return await ApiService.getData(`${apiServiceEndPoint}/registerApplication/jersey/schemamapper/getmappedschema/${appId}`);
  }

  static async getOfflineCertificationDetails(certificationId) {
    return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getOfflineCertificationDetails/${certificationId}`);
  }

  static async getAllApplications() {
    return await ApiService.getData(`${apiServiceEndPoint}/registerApplication/jersey/register/getAllApplications `);
  }

  static async getAllOrphanAccounts() {
    return await ApiService.getData(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/getOrphanAccounts `);
  }

  static async getAllSupportedObjects() {
    return await ApiService.getData(`${apiServiceEndPoint}/registerApplication/jersey/register/getAllSupportedObjects `);
  }

  static async getRegisterApplication() {
    return await ApiService.getData(`${apiServiceEndPoint}/registerApplication/jersey/schemamapper/getscim `);
  }

  async getEntitlemntsCertificationList(campaignId) {
    return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getEntitlements/${getUserName()}/${campaignId}`);
  }

  async getEntitlemntsCertificationListInfo(entName, campaignId) {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getUserDetailsbyEntitlement/${getUserName()}/${campaignId}/${entName}`);
  }

  async getCertificationCompleteDetails(certificationId) {
      return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getCertificationCompleteDetails/${certificationId}`);
  }

  static async submitWorkflow(data, headers) {
    const config = {
      headers: {
        ...(headers || {})
      }
    };
    const response = await axiosInstance.post(`${requestAPIServiceEndPoint}/workflowv1/submit`, data, config)
    return response && response.data;
  }

  static async getReportCampaignDetails(body) {
    return await ApiService.postMethod(`${apiServiceEndPoint}/certification/${getTenantId()}/getReportCampaignDetails`, body);
  }

  static async getOCIPolicies() {
    return await ApiService.getData(`${apiServiceEndPoint}/IdentityViewer/jersey/IdentityViewer/${getTenantId()}/getOCIPolicies?application=OCI`);
  }

  static async getFailedTasks() {
    return await ApiService.getData(`${apiServiceEndPoint}/pgmodule/task/failedtask`);
  }

  static async getCertificationsList() {
    return await ApiService.getData(`${apiServiceEndPoint}/certification/${getTenantId()}/getCertifications/${getUserName()}`);
  }
}
