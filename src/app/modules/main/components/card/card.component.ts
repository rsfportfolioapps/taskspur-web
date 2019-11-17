import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Card, CardPoint, CardStatus } from '../../../../models/card.model';
import { OverlayPanel, MessageService, ConfirmationService } from 'primeng/primeng';
import { MainService } from '../../main.service';
import { ModalService } from '../../../../services/modal.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AEMode } from '../../../../models/generic.model';
import { CardDetailComponent } from '../card-detail/card-detail.component';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { MainState } from '../../main.reducer';
import { cardsSelector, getItemById } from '../../main.selector';
import { filter } from 'rxjs/operators';
import { CommonEntityService } from '../../../../services/common.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input()
  public cards: Card[];

  public form: FormGroup;
  public cardPoints: any[] = [];
  public selectedCard$: any;
  public showCopyCardDialog: boolean = false;
  public showRescheduleDialog: boolean = false;
  public cardStatus = CardStatus;
  public rescheduleContentStyle: any = { 'width': '400px', 'max-height': '250px' };
  public aeModeCopy: AEMode.Copy;
  public baseZIndex: number = 1000;
  public positionTop: number = 20;
  public showEditCardDialog: boolean = false;
  public contentStyle: any = { 'min-height': '600px' };
  
  @Output()
  public cardIdEmitter = new EventEmitter<any>();

  @Output()
  public reloadEmitter = new EventEmitter<any>();

  @ViewChild('op') op: OverlayPanel;
  @ViewChild(CardDetailComponent) cdc: CardDetailComponent;

  constructor(private commonEntityService: CommonEntityService, private store: Store<MainState>, private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService, public modalService: ModalService, private mainService: MainService) {

    this.modalService.subscribe(this, this.onClose);
  }

  ngOnInit(): void {
    this.getCardPoints().map(el => this.cardPoints.push({ id: CardPoint[el], value: el }));
  }

  ngAfterViewInit(): void {
  }

  public selectCardOption(event: any, card: Card) {
    this.store.pipe(select(getItemById(card.id))).subscribe(card => {
      this.commonEntityService.setEntity(card);
    });
    this.op.toggle(event);
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

  // public onReschedule(): void {
  //   if (this.selectedCard) {
  //     this.form.get('reschedule').patchValue(moment(this.selectedCard.expectedCompletion).format('MM/DD/YYYY'));
  //     this.op.hide();
  //   }
  // }

  // public updateSchedule(): void {
  //   if (this.selectedCard) {
  //     let scheduledCard: Card = Object.assign({}, this.selectedCard);
  //     scheduledCard['expectedCompletion'] = this.form.get('reschedule').value;

  //     this.mainService.updateCardSchedule(scheduledCard).subscribe(() => this.onClose())
  //   }
  // }

  public onClose(): void {
    this.showEditCardDialog = false;
    this.showCopyCardDialog = false;
  }

  public isActiveStatus(currStatus: number, cardStatus: number, ): boolean {
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

  public onArchive(card: Card): void {
    this.confirmationService.confirm({
      key: 'bc',
      message: 'Are you sure that you want to Archive this card?',
      header: 'Confirmation',
      accept: () => {
        this.mainService.archiveCard(card.id).subscribe(() => {
          this.messageService.add({ key: 't', severity: 'info', detail: `${card.name} is successfully archived.` });
          this.cdc.refreshClose();
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

  public onCopy(): void {
    this.showCopyCardDialog = true;
  }

  public onEdit(id: number) {
    this.showEditCardDialog = true;

    this.store.pipe(select(getItemById(id))).subscribe(card => this.commonEntityService.setEntity(card));
  }

  public onUpdate(): void {
    this.cdc.aeMode = 2;
    this.showEditCardDialog = false;
    this.cdc.onSubmit();
  }

  public getCardPoints(): Array<string> {
    const keys = Object.keys(CardPoint);
    return keys.slice(keys.length / 2);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.op) {
      this.op.hide();
    }
  }
}


