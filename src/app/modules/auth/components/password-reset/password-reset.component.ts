import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserPasswordReset } from '../../../../models/user.model';
import { MessageService } from 'primeng/api';
import { passwordValidationRegex } from "../../../../shared/utils";
import { ErrorService } from '../../../../services/error.service';
import { Error } from '../../../../models/error.model';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class ForgotPasswordResetComponent implements OnInit {
  public passwordResetForm: FormGroup;
  public isSubmitting: boolean = false;
  public passwordResetSuccess: boolean = false;
  public isInvalidPassword: boolean = true;
  public isInvalidRePassword: boolean = true;
  public errorMsg: string = '';
  public showErrMessage: boolean = false;

  public validCharCount: boolean = false;
  public validPasswordChar: boolean = false;

  public isShowErrHint: boolean = false;
  public isShowErrHintRe: boolean = false;

  

  constructor(private router: Router, 
              private messageService: MessageService, 
              private authService: AuthService, 
              private route: ActivatedRoute, 
              private formBuilder: FormBuilder,
              private errorService: ErrorService
  ) {
    this.passwordResetForm = this.formBuilder.group({
      password: ["",
        [Validators.required, Validators.pattern(passwordValidationRegex)]
      ],
      repeatPassword: ["", [Validators.required, Validators.pattern(passwordValidationRegex)]],
    });

    this.errorService.errorsEmitter.subscribe((errors: Error[]) => {
      let _errors: any[] = [];
      errors.forEach(error => {
        _errors.push({ severity: 'error', summary: error.msg })
      });
      this.messageService.clear();
      this.messageService.addAll(_errors);
    })
  }

  ngOnInit(): void {}

  public showPassword(event: any): void {
    if(event.type === 'text') {
      event.type = 'password';
    } else {
      event.type = 'text';
    }
  }


  public validatePassword(): void {   
    this.isShowErrHint = true; 

    if(this.passwordResetForm.get('password').value.length >= 8) {
      this.validCharCount = true;
    } else {
      this.validCharCount = false;
    }

    if (!this.passwordResetForm.get('password').valid
      && this.passwordResetForm.get('password').dirty
      && this.passwordResetForm.get('password').value != '') {
      this.validPasswordChar = false;
    } else {
      this.validPasswordChar = true;
    }
  
  }

  public validateRePassword(): void {
    this.isShowErrHintRe = true; 
    if (!this.passwordResetForm.get('repeatPassword').valid
      && this.passwordResetForm.get('repeatPassword').dirty
      && this.passwordResetForm.get('repeatPassword').value != '') {
        this.isInvalidRePassword = true;
    } else {
      if(this.passwordResetForm.get('repeatPassword').value != '') {
        this.isInvalidRePassword = false;
      }
    }
  }

  public onSubmit(): void {
    this.isSubmitting = true;
    const payload: UserPasswordReset = {
      newPassword: this.passwordResetForm.value.password,
      userId: this.route.snapshot.queryParamMap.get('userId'),
      code: this.route.snapshot.queryParamMap.get('code')
    }

    if(payload.newPassword && payload.userId && payload.code) {
      this.authService.forgotPasswordReset(payload).subscribe(response => {
        if(response.success) {
          this.passwordResetSuccess = true;
          this.isSubmitting = false;

          this.router.navigateByUrl('reset-password-success');
        }
      },
      err => {
        this.errorMsg = err['error']['errorMessage'];
        this.showErrMessage = true;
        this.isSubmitting = false;
        setTimeout(() => {
          this.passwordResetForm.reset();
        }, 1000);

        setTimeout(() => {
          this.showErrMessage = false;
        }, 6000);

      })
    }
  }
}
