
import { MainActions, MainActionTypes } from './main.actions';
import { Board } from '../../models/board.model';
import { Card } from '../../models/card.model';
import { UserProfile } from '../../models/user.model';

export interface MainState {
  IsProfileInfoLoaded?: Boolean,
  boards?: Board[],
  cards?: Card[],
  profileInfo?: UserProfile,
  boardFilters: any[],
}

export const initialMainState: MainState = {
  IsProfileInfoLoaded: false,
  cards: [],
  boards: [],
  profileInfo: undefined,
  boardFilters: undefined,
};

export function mainReducer(MainState = initialMainState, action: MainActions): MainState {
  switch (action.type) {
    case MainActionTypes.isPILoadedAction:
      return Object.assign({}, MainState, {
        IsProfileInfoLoaded: action.payload.isPILoadedAction
      });

    case MainActionTypes.loadCardsAction:
      return Object.assign({}, MainState, {
        cards: action.payload.cards
      });

    case MainActionTypes.loadArchivedCardsAction:
      return Object.assign({}, MainState, {
        archivedCards: action.payload.archivedCards
      });

    case MainActionTypes.loadBoardsAction:
      return Object.assign({}, MainState, {
        boards: action.payload.boards
      });

    case MainActionTypes.profileInfoAction:
      return Object.assign({}, MainState, {
        profileInfo: action.payload.profileInfo
      });

    case MainActionTypes.setBoardFilter:
      return Object.assign({}, MainState, {
        ids: action.payload.ids
      })

    default:
      return MainState;
  }
}
