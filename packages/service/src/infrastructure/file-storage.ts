import { Dropbox } from 'dropbox';
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
    FileStorage.logger.info(`Uploading file "${path}" to Dropbox`);

    await this.client.filesUpload({ path, contents });

    FileStorage.logger.info('Setting file permissions');

    const shareResponse = await this.client.sharingCreateSharedLinkWithSettings({
      path,
      settings: {
        require_password: false,
        audience: { '.tag': 'public' },
        access: { '.tag': 'viewer' },
        allow_download: true,
      },
    });

    FileStorage.logger.info(`Uploaded file "${path}" to Dropbox`);

    const url = shareResponse.result.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
    return { url };
  }

  static readonly instance: FileStorage = new FileStorage();
}

export default FileStorage;
