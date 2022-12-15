import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../common/configs/config';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload file', async () => {
    const file =
      'text/plain;base64,ewogICJsYW5ndWFnZSI6ICJ0cyIsCiAgImNvbGxlY3Rpb24iOiAiQG5lc3Rqcy9zY2hlbWF0aWNzIiwKICAic291cmNlUm9vdCI6ICJzcmMiLAogICJjb21waWxlck9wdGlvbnMiOiB7CiAgICAicGx1Z2lucyI6IFsiQG5lc3Rqcy9ncmFwaHFsL3BsdWdpbiJdCiAgfQp9Cg==';
    const result = await service.uploadFile(file, 'test');
  });
});
