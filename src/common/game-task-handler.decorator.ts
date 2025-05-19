import { SetMetadata } from '@nestjs/common';
import { GameTaskType } from './game-task-type.enum';

export const GAME_TASK_HANDLER_METADATA_KEY = 'GAME_TASK_HANDLER_METADATA_KEY';

export const GameTaskHandler = (taskType: GameTaskType): ClassDecorator =>
  SetMetadata(GAME_TASK_HANDLER_METADATA_KEY, taskType);
