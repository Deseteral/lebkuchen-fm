import { Dropbox, sharing } from 'dropbox';
import Configuration from './configuration';
import Logger from './logger';

interface FileUploadResult {
  url: string,
}

class FileStorage {
  private static logger = new Logger('dropbox-file-storage');
  private client: Dropbox;

  private constructor() {
    this.client = new Dropbox({ accessToken: Configuration.DROPBOX_TOKEN });
  }

  async uploadFile({ path, contents }: { path: string, contents: Buffer }): Promise<FileUploadResult> {
    // TODO: Error handling
    await this.client.filesUpload({ path, contents });

    const shareSettings: sharing.SharedLinkSettings = {
      require_password: false,
      audience: { '.tag': 'public' },
      access: { '.tag': 'viewer' },
      allow_download: true,
    };

    const shareResponse = await this.client.sharingCreateSharedLinkWithSettings({ path, settings: shareSettings });
    const { url } = shareResponse.result;
    const directUrl = url.replace('https://www.dropbox.com', 'http://dl.dropboxusercontent.com');

    return { url: directUrl };
  }

  static readonly instance: FileStorage = new FileStorage();
}

export default FileStorage;
