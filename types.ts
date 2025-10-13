export interface DownloadItem {
  id: string;
  title: string;
  downloadUrl: string;
  refreshUrl:string;
  group?: string;
  lastRefreshed?: string;
}
