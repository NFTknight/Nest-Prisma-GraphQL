import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Endpoint, S3, CredentialProviderChain } from 'aws-sdk';
import { StorageConfig } from 'src/common/configs/config.interface';

@Injectable()
export class StorageService {
  private readonly config: StorageConfig;
  private readonly s3: S3;
  constructor(private readonly configService: ConfigService) {
    CredentialProviderChain.defaultProviders = [];
    this.config = this.configService.get('storage');
    this.s3 = new S3({
      endpoint: new Endpoint(this.config.enpoint),
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
    });
  }

  uploadFile(base64File: string, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const [mimeType, base64] = base64File.split(';base64,');
      const fileKey = key;
      const params = {
        Bucket: this.config.space,
        Key: fileKey,
        Body: Buffer.from(base64, 'base64'),
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: mimeType,
      };
      this.s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  }
}
