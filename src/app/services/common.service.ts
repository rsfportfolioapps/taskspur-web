import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { ITimezone } from "../models/timezone.model";
import { BaseService } from "./base.service";
import { ImageResponse } from "../models/image.model";

@Injectable()
export class CommonService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  public getTimezones(): Observable<ITimezone[]> {
    return this.get("/api/timezones?source=timezonedb");
  }

  public uploadImage(formData: FormData): Observable<ImageResponse> {
    return this.upload("/api/photo/upload", formData);
  }

  public uploadCardAttachment(formData: FormData): Observable<any> {
    return this.upload("/api/card/attachment", formData);
  }
}

@Injectable()
export class CommonEntityService {
  entity$: Observable<any>;
  private _setEntity: Subject<any> = new Subject();

  constructor() {
    this.entity$ = this._setEntity.asObservable();
  }

  public setEntity(entity) {
    this._setEntity.next(entity);
  }


}
