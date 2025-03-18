import { Controller, Get, Logger } from '@nestjs/common';
import { ClusterService, DEFAULT_CLUSTER } from '@liaoliaots/nestjs-redis';
import { Cluster } from 'ioredis';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  private readonly cluster: Cluster;

  constructor(
    private readonly clusterService: ClusterService
  ) {
    this.cluster = this.clusterService.getOrThrow(DEFAULT_CLUSTER);
  }

  @Get('test')
  async getHello(): Promise<any> {
    const keys = [];
    for (let i = 0; i < 100; i++) {
      keys.push('f:test' + i);
      await this.cluster.set('f:test' + i, i.toString());
    }
    const result = await this.cluster.mget(keys);
    return result;
  }

  @Get('scan')
  async scan(): Promise<any> {
    const result = await this.cluster.scan('f:*');
    return result;
  }
}
