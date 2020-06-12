export class SessionStorageService {
  static async getClientId() {
    return sessionStorage.getItem('clientId');
  }
  static async setClientId(data) {
    return sessionStorage.setItem('clientId', data);
  }
}
