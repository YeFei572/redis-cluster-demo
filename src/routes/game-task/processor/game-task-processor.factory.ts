import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GameTaskType } from 'src/common/game-task-type.enum';
import { IGameTaskProcessor } from './game-task-processor.interface';
import { ModuleRef } from '@nestjs/core';
import { AxeProcessor } from './axe.processor';
import { PickaxeProcessor } from './pickaxe.processor';

@Injectable()
export class GameTaskProcessorFactory implements OnModuleInit {
  private readonly logger = new Logger(GameTaskProcessorFactory.name);
  private processors = new Map<GameTaskType, IGameTaskProcessor>();

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.registerProcessor(GameTaskType.Axe, AxeProcessor);
    this.registerProcessor(GameTaskType.Pickaxe, PickaxeProcessor);
    this.logger.log(`Registered ${this.processors.size} processors`);
  }

  private registerProcessor(
    type: GameTaskType,
    processorClass: new (...args: any[]) => IGameTaskProcessor,
  ) {
    try {
      const processorInstance = this.moduleRef.get(processorClass, {
        strict: false,
      });
      this.processors.set(type, processorInstance);
      this.logger.localInstance.log(`Registered processor for ${type}`);
    } catch (error) {
      this.logger.error(
        `Error registering processor for type ${type}: ${error.message}`,
      );
    }
  }

  /**
   * 获取处理器
   * @param type GameTaskType
   * @returns
   */
  getProcessor(type: GameTaskType): IGameTaskProcessor | undefined {
    const processor = this.processors.get(type);
    if (!processor) {
      this.logger.error(`No processor found for type ${type}`);
    }
    return processor;
  }
}
