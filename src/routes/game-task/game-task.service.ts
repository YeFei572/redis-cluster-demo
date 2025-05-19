import { Injectable } from '@nestjs/common';
import { GameTaskProcessorFactory } from './processor/game-task-processor.factory';
import { GameTaskType } from 'src/common/game-task-type.enum';

@Injectable()
export class GameTaskService {
  constructor(private readonly processorFacotry: GameTaskProcessorFactory) {}
  async test(taskType?: GameTaskType) {
    const processor = this.processorFacotry.getProcessor(taskType);
    if (processor) {
      return processor.process({
        type: taskType,
        data: {},
        timestamp: Date.now(),
      });
    }
    return 'test';
  }
}
