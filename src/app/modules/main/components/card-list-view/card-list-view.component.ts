import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card, CardPoint, CardStatus } from '../../../../models/card.model';
import { OverlayPanel, MessageService, ConfirmationService } from 'primeng/primeng';
import { MainService } from '../../main.service';
import { ModalService } from '../../../../services/modal.service';
import { getCardStatus } from '../../../../shared/functions/card-status.func';
import { CardDetailComponent } from '../card-detail/card-detail.component';
import { AEMode } from '../../../../models/generic.model';
import { Store, select } from '@ngrx/store';
import { MainState } from '../../main.reducer';
import { getItemById } from '../../main.selector';
import { CommonEntityService } from '../../../../services/common.service';

//TODO: refactor to use different html file but the same ts file
@Component({
  selector: 'app-card-list-view',
  templateUrl: './card-list-view.component.html',
  styleUrls: ['./card-list-view.component.scss']
})
export class CardListViewComponent implements OnInit {
  @Input()
  public cards: Card[];

  public cardPoints: any[] = [];
  public selectedCard: any;
  public showCopyCardDialog: boolean = false;
  public baseZIndex: number = 1000;
  public positionTop: number = 20;
  public contentStyle: any = { 'min-height': '600px' };
  public showEditCardDialog: boolean = false;
  public cardStatus = CardStatus;

  @Output()
  public cardIdEmitter = new EventEmitter<any>();

  @Output()
  public reloadEmitter = new EventEmitter<any>();

  @ViewChild('op') op: OverlayPanel;
  @ViewChild(CardDetailComponent) cdc: CardDetailComponent;

  constructor(private commonEntityService: CommonEntityService, private store: Store<MainState>, private confirmationService: ConfirmationService, private messageService: MessageService, public modalService: ModalService, private mainService: MainService) { 
    this.modalService.subscribe(this, this.onClose);
  }

  public onClose(): void {
    this.showEditCardDialog = false;
    this.showCopyCardDialog = false;
  }

  ngOnInit(): void {
    this.getCardPoints().map(el => this.cardPoints.push({ id: CardPoint[el], value: el }));
  }

  public selectCardOption(event: any, card: Card) {
    this.store.pipe(select(getItemById(card.id))).subscribe(card => this.commonEntityService.setEntity(card));
    this.op.toggle(event);
  }

  public isActiveStatus(currStatus: number, cardStatus: number): boolean {
    return currStatus === cardStatus;
  }

  public onUpdateStatus(id: number, status: number): void {
    this.mainService.updateCardStatus(id, status).subscribe(() => {
      this.onClose();
      this.reloadEmitter.emit(true);
    })
  }

  public onSaveCopy(): void {
    this.showCopyCardDialog = false;
    this.cdc.aeMode = 3;
    this.cdc.onSubmit();
  }
  
  public onCopy(): void {
    this.showCopyCardDialog = true;
  }

  public onEdit(id: number) {
    this.showEditCardDialog = true;
  }

  public onUpdate(): void {
    this.cdc.aeMode = 2;
    this.showEditCardDialog = false;
    this.cdc.onSubmit();
  }

  public onDelete(card: Card): void {
    this.confirmationService.confirm({
      key: 'bc',
      message: 'Are you sure that you want to delete this card?',
      header: 'Confirmation',
      accept: () => {
        this.mainService.deleteCard(card.id).subscribe(res => {
          this.messageService.add({ key: 't', severity: 'success', detail: `${card.name} is successfully deleted.` });

          this.reloadEmitter.emit(true);
          this.modalService.propagate();
        })
      },
      reject: () => {
        return false;
      }
    });
  }

  public onArchive(card: Card): void {
    this.confirmationService.confirm({
      key: 'bc',
      message: 'Are you sure that you want to Archive this card?',
      header: 'Confirmation',
      accept: () => {
        this.mainService.archiveCard(card.id).subscribe(() => {
          this.op.hide();
          this.reloadEmitter.emit(true);
          this.modalService.propagate();
          this.messageService.add({ key: 't', severity: 'info', detail: `${card.name} is successfully archived.` });
        })
      },
      reject: () => {
        return false;
      }
    });
  }

  public getCardPoint(point: number): string {
    const cardPoint = (point === 0 ? 1 : point);

    return this.cardPoints.filter(point => point.id === cardPoint)[0].value;
  }

  public getCardPoints(): Array<string> {
    const keys = Object.keys(CardPoint);
    return keys.slice(keys.length / 2);
  }
}
