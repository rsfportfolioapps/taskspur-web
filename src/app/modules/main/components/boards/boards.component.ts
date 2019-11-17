import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Board } from '../../../../models/board.model';
import { MessageService, MenuItem } from 'primeng/api';
import * as _ from 'lodash';
import { AEMode } from '../../../../models/generic.model';
import { Store, select } from '@ngrx/store';
import { MainState } from '../../main.reducer';
import { boardsSelector } from '../../main.selector';
import { MainService } from '../../main.service';
import { LoadBoardsAction, LoadCardsAction } from '../../main.actions';
import { distinctUntilChanged } from 'rxjs/operators';
import { ModalService } from '../../../../services/modal.service';
import { BoardDetailComponent } from '../board-detail/board-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit, AfterViewInit {
  public breadcrumbs = [
    {
      text: 'Dashboard',
      path: '/dashboard'
    },
    {
      text: 'Boards',
      path: ''
    }
  ];
  public boards: Board[] = [];
  public filterBoards: any = [];
  public selectedItemsLabel = "{0} Boards selected";
  public filterPlaceHolder = "Search Board";
  public defaultLabel = "Select Board";
  public aeModeNew: AEMode = AEMode.Add;
  public animationState: string = 'small';
  public membersDisplay: boolean = false;
  public newBoardDisplay: boolean = false;
  public deleteConfirmText: string = 'Are you sure you want to delete this board?';
  public filtered: Board[] = [];
  public showAddBoard: boolean = false;
  public baseZIndex: number = 1000;
  public positionTop: number = 20;
  public boardContentStyle: any = { 'width': '800px' };
  public boardTabs: MenuItem[];
  public activeTab: MenuItem;
  public isArchived: boolean = false;
  public members;

  @ViewChild(BoardDetailComponent) boardDetailComponent: BoardDetailComponent;

  constructor(private route: Router, private cdRef: ChangeDetectorRef, public modalService: ModalService, private mainService: MainService, private store: Store<MainState>, private messageService: MessageService) {
    this.modalService.subscribe(this, this.onCloseDialog);
  }

  ngOnInit(): void {
    this.boardTabs = [
      {
        label: 'Active', command: () => {
          this.load(true, this.isArchived = false);
        }
      },
      {
        label: 'Archive', command: () => {
          this.load(true, this.isArchived = true);
        }
      }
    ];
    
    this.activeTab = this.boardTabs[0];
  }

  ngAfterViewInit() {
    this.load();

    this.cdRef.detectChanges();
  }

  public onCloseDialog(): void {
    this.showAddBoard = false;
  }

  public gotoCard(): void {
    this.route.navigateByUrl('cards');
  }

  public load(reload: boolean = false, isArchived: boolean = false): void {
    this.boards = [];
    
    if (reload) {
      this.mainService.getBoards(isArchived).subscribe(response => this.store.dispatch(new LoadBoardsAction({ boards: response })));

      //also refresh card
      this.mainService.getCards().subscribe(cards => this.store.dispatch(new LoadCardsAction({ cards })));
    } else {
      this.store.pipe(select(boardsSelector), distinctUntilChanged()).subscribe(response => {
        if (response) {
          this.boards = response;

          this.filterBoards = [];
          this.boards.forEach(board => {
            this.filterBoards.push({ label: board.name, value: board.name });
          });
        }
      })
    }
  }

  public onBoardSave(): void {
    this.showAddBoard = false;
    this.boardDetailComponent.onSubmit();
  }

  public onFilterByBoards(event: any): void {
    if (this.boards) {
      this.filtered = _.filter(this.boards, (v) => _.includes(event.value, v.name)); //filter boards 
    }
  }

  public onDisplayMembers(): void {
    this.membersDisplay = !this.membersDisplay;
  }

  public onDisplayNewBoard(): void {
    this.newBoardDisplay = !this.newBoardDisplay;
  }

  public onReject(): void {
    this.messageService.clear();
  }

  public onConfirm(): void {
    this.messageService.clear();
  }
}
