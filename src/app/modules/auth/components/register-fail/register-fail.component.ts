import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'register-fail',
  templateUrl: './register-fail.component.html',
  styleUrls: ['./register-fail.component.scss']
})
export class RegisterFailComponent implements OnInit {
  public isExist: boolean = false;
  private sub: any;

  constructor(private route: ActivatedRoute) { 
    this.sub = this.route.params.subscribe(params => {
      if(atob(params['errorCode']) == '3') {
        this.isExist= true;
      }
   });
  }

  ngOnInit() {
  }

}
