import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MainActionTypes, IsPILoadedAction, LoadCardsAction, ProfileInfoAction, IsArhivedCardsLoaded, SetBoardFilter } from './main.actions';
import { tap, switchMap, distinctUntilChanged, map } from 'rxjs/operators';
import { MainService } from './main.service';


@Injectable()
export class MainEffects {

  constructor(private mainService: MainService, private actions$: Actions) { }

  @Effect({ dispatch: false })
  public userInfo$ = this.actions$.pipe(
    ofType<IsPILoadedAction>(MainActionTypes.isPILoadedAction),
    tap(action => {
      localStorage.setItem("isProfileInfoLoaded", JSON.stringify(true))
    })
  )

  @Effect({ dispatch: false })
  public IsArchivedCardsLoaded$ = this.actions$.pipe(
    ofType<IsArhivedCardsLoaded>(MainActionTypes.IsArhivedCardsLoadedAction),
    tap(() => {
      localStorage.setItem("isArchivedCardsLoaded", JSON.stringify(true))
    })
  )

  @Effect({ dispatch: false })
  public profileInfo$ = this.actions$.pipe(
    ofType<ProfileInfoAction>(MainActionTypes.profileInfoAction),
    tap(action => {
      localStorage.setItem("profileInfo", JSON.stringify(action.payload.profileInfo))
    })
  )

  @Effect({ dispatch: false })
  public setBoardFilter$ = this.actions$.pipe(
    ofType<SetBoardFilter>(MainActionTypes.setBoardFilter),
    tap(action => {
      localStorage.setItem("boardFilters", JSON.stringify(action.payload.ids))
    })
  )


}
