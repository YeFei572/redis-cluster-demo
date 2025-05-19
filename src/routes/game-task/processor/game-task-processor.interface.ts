import { IGameTaskPayload } from 'src/common/game-task-type.enum';

export interface IGameTaskProcessor {
  process(payload: IGameTaskPayload<any>): Promise<void>;
}
