import { Logger } from '@nestjs/common';
import { IGameTaskProcessor } from './game-task-processor.interface';
import { IGameTaskPayload } from 'src/common/game-task-type.enum';

export class AxeProcessor implements IGameTaskProcessor {
  private readonly logger = new Logger(AxeProcessor.name);
  async process(
    payload: IGameTaskPayload<{ specificData: string }>,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`伐木活动。。 ${payload}`);
  }
}
