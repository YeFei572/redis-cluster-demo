import { Controller, Get, Query } from '@nestjs/common';
import { GameTaskService } from './game-task.service';
import { GameTaskType } from 'src/common/game-task-type.enum';

@Controller('game-task')
export class GameTaskController {
  constructor(private readonly gameTaskService: GameTaskService) {}

  @Get()
  async test(@Query('taskType') taskType: GameTaskType) {
    return this.gameTaskService.test(taskType);
  }
}
