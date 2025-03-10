import { ConfigService as NestConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  public getMongoURI(): string {
    const user = this.configService.get('MONGO_USER');
    const pass = this.configService.get('MONGO_PASS');
    const host = this.configService.get('MONGO_HOST');
    const port = this.configService.get('MONGO_PORT');
    const db = this.configService.get('MONGO_DB');

    return `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;
  }

  public getApiServerPort() {
    return this.configService.get('PORT');
  }

  public isProduction() {
    const mode = this.configService.get('MODE');
    return mode == 'prod' || mode == 'production';
  }

  public getJWTSecret(): string {
    return this.configService.getOrThrow('JWT_SECRET');
  }

  public getApiPrefix() {
    return this.configService.get('API_PREFIX') || '';
  }
}
