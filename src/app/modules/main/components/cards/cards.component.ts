import { Component, OnInit, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { Card } from '../../../../models/card.model';
import { MainService } from '../../main.service';
import { Store, select } from '@ngrx/store';
import { MainState } from '../../main.reducer';
import { mainSelector, archivedCardsSelector } from '../../main.selector';
import { Board } from '../../../../models/board.model';
import * as _ from 'lodash';
import { LoadCardsAction, LoadArchivedCardsAction, IsArhivedCardsLoaded } from '../../main.actions';
import { AEMode } from '../../../../models/generic.model';
import { getCardStatus } from '../../../../shared/functions/card-status.func';
import { ModalService } from '../../../../services/modal.service';
import { FormGroup } from '@angular/forms';
import { CardDetailComponent } from '../card-detail/card-detail.component';
import { BoardDetailComponent } from '../board-detail/board-detail.component';
import { LocalStorageService } from '../../../../services/localStorage.service';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})

export class CardsComponent implements OnInit, AfterViewInit {
  public breadcrumbs = [
    {
      text: 'Dashboard',
      path: '/dashboard'
    },
    {
      text: 'Cards',
      path: ''
    }
  ];
  public boardFilters: any = [];
  public boards: Board[];
  public cards: Card[];
  public screenHeight: number;
  public screenWidth: number;
  public collapsed: boolean = true;
  public selectedItemsLabel = "{0} Boards selected";
  public filterPlaceHolder = "Search Board";
  public defaultLabel = "Select Board";
  public newBoardDisplay: boolean = false;
  public newCardDisplay: boolean = false;
  public initialCards: Card[] = [];
  public aeMode: AEMode = AEMode.Add;
  public showEditCardDialog: boolean = false;
  public selectedCard: Card;
  public cardStatus = getCardStatus();
  public showAddBoard: boolean = false;
  public isListView: boolean = false;
  public isMobileScreen: boolean = false;
  public showAddCardDialog: boolean = false;
  public form: FormGroup;
  public baseZIndex: number = 1000;
  public positionTop: number = 20;
  public defaulFilterValues: any[];
  public archievedCards: Card[];
  public contentStyle: any = { 'min-height': '600px' }

  @ViewChild(CardDetailComponent) cdc: CardDetailComponent;
  @ViewChild(BoardDetailComponent) bdc: BoardDetailComponent;

  constructor(private activatedRoute: ActivatedRoute, private localStorageService: LocalStorageService, public modalService: ModalService, private mainService: MainService, private store: Store<MainState>) {
    this.getScreenSize();

    this.modalService.subscribe(this, this.onClose);
  }

  public getStatusByCards(cards: Card[], status: number): Card[] {
    return cards.filter(s => s.status === status);
  }

  public onShowCardDialog(): void {
    this.showAddCardDialog = !this.showAddCardDialog;
    this.cdc.form = this.cdc.createCardForm();
    this.cdc.aeMode = 1;
  }

  public onSearch(searchTerm: string): void {
    this.initialCards = _.filter(this.cards, (card) => {
      return card.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  public onFilterCardByBoards(event: any): void {
    const filterVal: any = _.has(event, 'value') ? event.value : event;

    if (filterVal && filterVal.length > 0) {
      if (this.getCardView() === 3) {
        this.archievedCards = _.filter(this.cards, (v) => _.includes(filterVal, v.boardId));
      } else {
        this.initialCards = _.filter(this.cards, (v) => _.includes(filterVal, v.boardId));
        this.initialCards = filterVal.length === 0 ? this.cards : this.initialCards;
      }

      this.initialCards.forEach(card => {
        this.getStatusByCards(this.initialCards, card.status);
      });
    }
  }

  ngOnInit(): void {
    this.load();
    this.loadArchivedCards();
    this.setCardView(1);
  }

  ngAfterViewInit(): void {
  }

  public loadArchivedCards(reload: boolean = false): void {
    if (reload) {
      this.mainService.getArchivedCards().subscribe((archivedCards: Card[]) => this.store.dispatch(new LoadArchivedCardsAction({ archivedCards })));
    } else {
      this.store.pipe(select(archivedCardsSelector), distinctUntilChanged()).subscribe((archivedCards: Card[]) => {
        this.archievedCards = archivedCards
      });
    }
  }

  public load(reload: boolean = false): void {
    if (reload) {
      this.mainService.getCards().subscribe(cards => {
        this.store.dispatch(new LoadCardsAction({ cards }));
      });
    } else {
      this.store.pipe(select(mainSelector), distinctUntilChanged()).subscribe(response => {
        if (response) {
          const cards = response.cards || [];
          const boards = response.boards || [];

          if (cards && cards.length > 0) {
            this.cards = cards;
            this.initialCards = cards;
          }

          if (boards && boards.length > 0) {
            this.boards = boards;

            this.boardFilters = [];
            this.boards.forEach(board => {
              this.boardFilters.push({ label: board.name, value: board.id });
            });

            this.defaulFilterValues = [];

            //if it has boards params then filter all boards
            const boardId: number = +this.activatedRoute.snapshot.paramMap.get('board');
            if (boardId) {
              this.onFilterCardByBoards({ value: [boardId] });
              this.defaulFilterValues.push(boardId);
            } else {
              //all boards filter selected
              this.defaulFilterValues.push(...this.boards.map(x => x.id));
              this.onFilterCardByBoards({ value: this.defaulFilterValues });
            }
          }
        }
      })
    }
  }

  public getStatusCards(status: number): Card[] {
    return this.initialCards.filter(s => s.status === status && s.isArchived === false);
  }

  public isActiveStatus(currStatus: number, cardStatus: number, ): boolean {
    return currStatus === cardStatus;
  }

  public getCardView(): number {
    return this.localStorageService.getCardView();
  }

  public setCardView(value: number): void {
    if (this.getCardView() === 3) {
      this.defaulFilterValues = [];
    }
    localStorage.setItem('cardView', JSON.stringify(value));
  }

  public onSaveUpdate(): void {
    this.showAddCardDialog = false;
    this.cdc.onSubmit();
  }

  public onBoardSave(): void {
    this.showAddBoard = false;
    this.bdc.aeMode = 1;
    this.bdc.onSubmit();
  }

  public onClose(): void {
    this.showAddCardDialog = false;
    this.showAddBoard = false;
    this.cdc.onClose();
    // this.bdc.onClose();
  }

  @HostListener('window:resize', ['$event'])
  private getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (window.innerWidth > 768) {
      this.collapsed = true;
      this.isMobileScreen = false;
    } else {
      this.isMobileScreen = true;
      this.collapsed = false;
    }
  }
}
