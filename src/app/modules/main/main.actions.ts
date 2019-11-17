import { Action } from "@ngrx/store";
import { Board } from "../../models/board.model";
import { Card } from "../../models/card.model";
import { UserProfile } from "../../models/user.model";

export enum MainActionTypes {
  isPILoadedAction = "[main] isPILoadedAction",
  loadCardsAction = "[main] cards",
  IsArhivedCardsLoadedAction = "[main] IsArhivedCardsLoadedAction",
  loadArchivedCardsAction = "[main] archivedCards",
  loadBoardsAction = "[main] boards",
  profileInfoAction = "[main] profileInfo",
  setBoardFilter = "[main] SetBoardFilter"
}

export class IsPILoadedAction implements Action {
  readonly type = MainActionTypes.isPILoadedAction;

  constructor(public payload: { isPILoadedAction: boolean }) { }
}

export class ProfileInfoAction implements Action {
  readonly type = MainActionTypes.profileInfoAction;

  constructor(public payload: { profileInfo: UserProfile }) {}
}

export class LoadCardsAction implements Action {
  readonly type = MainActionTypes.loadCardsAction;

  constructor(public payload: { cards: Card[] }) { }
}

export class IsArhivedCardsLoaded implements Action {
  readonly type = MainActionTypes.IsArhivedCardsLoadedAction;

  constructor(public payload: { isLoaded: boolean }) { }
}


export class LoadArchivedCardsAction implements Action {
  readonly type = MainActionTypes.loadArchivedCardsAction;

  constructor(public payload: { archivedCards: Card[] }) { }
}

export class LoadBoardsAction implements Action {
  readonly type = MainActionTypes.loadBoardsAction;

  constructor(public payload: { boards: Board[] }) { }
}

export class SetBoardFilter implements Action {
  readonly type = MainActionTypes.setBoardFilter;

  constructor(public payload: { ids: number[] }) { }
}



export type MainActions = IsPILoadedAction | LoadCardsAction | LoadBoardsAction | ProfileInfoAction | LoadArchivedCardsAction | SetBoardFilter;
