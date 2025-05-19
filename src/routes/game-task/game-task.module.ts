import { Module, Provider } from '@nestjs/common';
import { GameTaskController } from './game-task.controller';
import { GameTaskService } from './game-task.service';
import { AxeProcessor } from './processor/axe.processor';
import { GameTaskProcessorFactory } from './processor/game-task-processor.factory';
import { PickaxeProcessor } from './processor/pickaxe.processor';

export const gameTaskProcessors: Provider[] = [AxeProcessor, PickaxeProcessor];

@Module({
  imports: [],
  controllers: [GameTaskController],
  providers: [...gameTaskProcessors, GameTaskProcessorFactory, GameTaskService],
  exports: [GameTaskService],
})
export class GameTaskModule {}
