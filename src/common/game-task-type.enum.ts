export enum GameTaskType {
  Axe = 'Axe',
  Pickaxe = 'Pickaxe',
  FishingPole = 'FishingPole',
}

export interface IGameTaskPayload<T = any> {
  type: GameTaskType;
  data: T;
  timestamp: number;
}
