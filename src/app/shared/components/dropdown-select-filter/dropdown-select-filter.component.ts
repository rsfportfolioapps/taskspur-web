import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-dropdown-multiselect-filter',
  templateUrl: './dropdown-select-filter.component.html',
  styleUrls: ['./dropdown-select-filter.component.scss']
})
export class DropdownSelectFilterComponent implements OnInit {
  public ddPanelVisible: boolean = false;

  @Input()
  public selectedItemsLabel = "{0} Filters selected";
  @Input()
  public filterPlaceHolder = "Search Filter";
  @Input()
  public defaultLabel = "Select Filter";
  @Input()
  public items: any[];
  @Input()
  public selectedItems: any[];
  @Input()
  public defaulFilterValues: number[] = [];

  @Output()
  public selectedItemEmitted = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    //check for default filter values
    if (this.defaulFilterValues && this.defaulFilterValues.length > 0) {
      this.selectedItems = this.items.filter(a => {
        const defaultValues = this.items.filter(r => this.defaulFilterValues.includes(r.value)).map(a => a.value);

        return defaultValues.length === this.items.length ? true : defaultValues.includes(a.value)
      }).map(a => a.value);
    }
  }

  public onShow(): void {
    this.ddPanelVisible = true;
  }

  public onHide(): void {
    this.ddPanelVisible = false;
  }

  public onSelect(event: any): void {
    this.selectedItemEmitted.emit(event);
  }
}
