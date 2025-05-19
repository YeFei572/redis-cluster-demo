import { IGameTaskPayload } from 'src/common/game-task-type.enum';
import { IGameTaskProcessor } from './game-task-processor.interface';
import { Logger } from '@nestjs/common';

export class PickaxeProcessor implements IGameTaskProcessor {
  private readonly logger = new Logger(PickaxeProcessor.name);
  async process(
    payload: IGameTaskPayload<{ specificatData: string }>,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`挖矿活动。。 ${payload}`);
  }
}
