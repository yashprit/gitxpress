export default class SettingService {

  private static instance:SettingService;

  static getInstance() {
    if (!SettingService.instance) {
      SettingService.instance = new SettingService();
    }
    return SettingService.instance;
  }

}