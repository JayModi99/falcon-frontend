import { Router } from '@angular/router';
import { FalconService } from './../../service/falcon.service';
import { EncryptDecryptService } from './../../service/EncryptDecrypt.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    loginForm: FormGroup;

    loading: boolean = false;

    showPassword: boolean = false;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private titleService: Title,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private encryptDecryptService: EncryptDecryptService,
        private falconService: FalconService,
        private _snackBar: MatSnackBar,
        private router: Router
    )
    {
        this.titleService.setTitle("Falcon - Login");
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            password: ['', [Validators.required]]
        });
        // console.log(this.encryptDecryptService.encryptData('jay'));
        // console.log(this.encryptDecryptService.decryptData('U2FsdGVkX19XZzNKpURcKqO4rSNrbwiVqN1tMVF3SRE='));
    }

    changePasswordVisibility(flag){
        this.showPassword = flag;
    }

    login(){
        this.loading = true;
        var data = {
            'email': this.loginForm.get('email').value, 
            'password': this.loginForm.get('password').value
        }
        this.falconService.login(data)
        .subscribe((result: any) => {
            if(result.length == 0){
                this.openSnackBar('Invalid Credentials');
            }
            else{
                var userId = result[0].id;
                //var userId = this.encryptDecryptService.encryptData(result[0].id);
                localStorage.setItem('userId', userId);
                localStorage.setItem('orgName', result[0].organisation_name);
                localStorage.setItem('orgEmail', result[0].email);
                this.openSnackBar('Login Successful');
                this.router.navigate(['product-category']);
            }
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to login');
            this.loading = false;
        });
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Close', {
          duration: 2000,
        });
    }

}
