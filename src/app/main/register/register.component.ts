import { FalconService } from './../../service/falcon.service';
import { OrganisationMaster } from './../../model/OrganisationMaster';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { EncryptDecryptService } from 'app/service/EncryptDecrypt.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    registerForm1: FormGroup;
    registerForm2: FormGroup;
    registerForm3: FormGroup;
    registerForm: OrganisationMaster;

    industryTypes: any;
    loading: boolean = true;

    passwordMatch: boolean = true;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

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
        private router: Router,
        private encryptDecryptService: EncryptDecryptService,
        private falconService: FalconService,
        private _snackBar: MatSnackBar
    )
    {
        this.titleService.setTitle("Falcon - Register");
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
        this.getIndustryType();
        this.registerForm1 = this._formBuilder.group({
            organisation_name: ['', [Validators.required]],
            industry_type: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            gst_no: ['', []],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', []],
            landline: ['', []],
            website: ['', []]
        });

        this.registerForm2 = this._formBuilder.group({
            address_1: ['', [Validators.required]],
            address_2: ['', []],
            city: ['', [Validators.required]],
            pincode: ['', [Validators.required]],
            state: ['', [Validators.required]],
            country: ['', [Validators.required]]
        });

        this.registerForm3 = this._formBuilder.group({
            name_1: ['', [Validators.required]],
            name_2: ['', []],
            phone_1: ['', [Validators.required]],
            phone_2: ['', []]
        });
    }

    getIndustryType(){
        this.loading = true;
        this.falconService.getIndustryType()
        .subscribe((result) => {
            this.industryTypes = result;
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to Load Industry Type');
            this.loading = false;
            //this.getIndustryType();
        });
    }

    passwordChange(){
        if(this.registerForm1.get('password').value != this.registerForm1.get('confirm_password').value){
          this.passwordMatch = false;
        }
        else{
          this.passwordMatch = true;
        }
      }

    changePasswordVisibility(flag){
        this.showPassword = flag;
    }

    changeConfirmPasswordVisibility(flag){
        this.showConfirmPassword = flag;
    }

    onRegister(){
        this.loading = true;
        this.registerForm = new OrganisationMaster();
        this.registerForm.organisation_name = this.registerForm1.get('organisation_name').value;
        this.registerForm.industry_type = this.registerForm1.get('industry_type').value;
        this.registerForm.email = this.registerForm1.get('email').value;
        this.registerForm.gst_no = this.registerForm1.get('gst_no').value;
        this.registerForm.password = this.registerForm1.get('password').value;
        this.registerForm.landline = this.registerForm1.get('landline').value;
        this.registerForm.website = this.registerForm1.get('website').value;
        this.registerForm.address_1 = this.registerForm2.get('address_1').value;
        this.registerForm.address_2 = this.registerForm2.get('address_2').value;
        this.registerForm.city = this.registerForm2.get('city').value;
        this.registerForm.pincode = this.registerForm2.get('pincode').value;
        this.registerForm.state = this.registerForm2.get('state').value;
        this.registerForm.country = this.registerForm2.get('country').value;
        this.registerForm.name_1 = this.registerForm3.get('name_1').value;
        this.registerForm.phone_1 = this.registerForm3.get('phone_1').value;
        this.registerForm.name_2 = this.registerForm3.get('name_2').value;
        this.registerForm.phone_2 = this.registerForm3.get('phone_2').value;

        this.falconService.save(this.registerForm)
        .subscribe((result: any) => {
            this.openSnackBar('Registration Successful');
            this.loading = false;
            this.router.navigate(['login']);
        },
        (error) => {
            this.openSnackBar('Failed to Register');
            this.loading = false;
        });

    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Close', {
          duration: 2000,
        });
    }

}
