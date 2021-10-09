import { Dropbox } from 'dropbox';
import { Service } from 'typedi';
import Configuration from './configuration';
import Logger from './logger';

interface FileUploadResult {
  url: string,
}

@Service()
class FileStorage {
  private static logger = new Logger('dropbox-file-storage');
  private client: Dropbox;

  constructor(private configuration: Configuration) {
    this.client = new Dropbox({ accessToken: this.configuration.DROPBOX_TOKEN });
  }

  async uploadFile({ path, contents }: { path: string, contents: Buffer }): Promise<FileUploadResult> {
    await this.uploadFileToDropbox(path, contents);
    const url = await this.getPublicUrlToDropboxFile(path);

    FileStorage.logger.info(`Uploaded file "${path}" to Dropbox`);

    return { url };
  }

  private async uploadFileToDropbox(path: string, contents: Buffer): Promise<void> {
    FileStorage.logger.info(`Uploading file "${path}" to Dropbox`);
    await this.client.filesUpload({ path, contents });
  }

  private async getPublicUrlToDropboxFile(path: string): Promise<string> {
    FileStorage.logger.info(`Setting public permissions for file "${path}"`);

    const shareResponse = await this.client.sharingCreateSharedLinkWithSettings({
      path,
      settings: {
        require_password: false,
        audience: { '.tag': 'public' },
        access: { '.tag': 'viewer' },
        allow_download: true,
      },
    });

    const url = shareResponse.result.url
      .replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com')
      .replace('?dl=0', '');

    return url;
  }
}

export default FileStorage;
