import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { OrganisationMaster } from 'app/model/OrganisationMaster';
import { FalconService } from 'app/service/falcon.service';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';

export interface ClientDialogData {
    type: string;
    id: number;
    client: OrganisationMaster;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit {

    dataLoading: boolean = true;
    loading: boolean = false;
    failed: boolean = false;
    clients: any;

    constructor(
        private titleService: Title,
        private falconService: FalconService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ){ 
        this.titleService.setTitle("Falcon - Clients");
    }

    ngOnInit(){
        this.getClients();
     }

    getClients(){
        this.dataLoading = true;
        this.failed = false;
        this.falconService.getClient()
        .subscribe((result) => {
            this.clients = result;
            this.dataLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.dataLoading = false;
            this.failed = true;
        });
    }

    openClientAddDialog(type, id, client: OrganisationMaster) {
        const dialogRef = this.dialog.open(AddClientDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                client: client
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.clients.length = 0;
                this.getClients();
            }
        });
    }

    deleteClient(id, index){
        const dialogRef = this.dialog.open(DeleteDialog, {
            disableClose: true, 
            autoFocus: false
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == 1){
                this.loading = true;
                this.falconService.deleteClient(id)
                .subscribe((result) => {
                    this.openSnackBar('Client Deleted');
                    this.loading = false;
                    this.clients.splice(index, 1);
                },
                (error) => {
                    this.openSnackBar('Failed to Delete');
                    this.loading = false;
                });
            }
        });
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
    }

}

@Component({
    selector: 'add-client-dialog',
    templateUrl: 'add-client-dialog.html',
    styleUrls: ['./client.component.scss']
  })
  export class AddClientDialog {

    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    clientForm1: FormGroup;
    clientForm2: FormGroup;
    clientForm3: FormGroup;
    clientForm: OrganisationMaster;

    productCategoryForm: FormGroup;

    industryTypes: any;
    areas: any;
    loading: boolean = false;

    passwordMatch: boolean = true;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ClientDialogData,
        public dialogRef: MatDialogRef<AddClientDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar
    ){ }

    ngOnInit(): void
    {
        this.getIndustryType(); 
        this.clientForm1 = this._formBuilder.group({
            organisation_name: [this.data.client.organisation_name, [Validators.required]],
            industry_type: [+this.data.client.industry_type, [Validators.required]],
            email: [this.data.client.email, [Validators.required, Validators.pattern(this.emailPattern)]],
            gst_no: [this.data.client.gst_no, []],
            password: [this.data.client.password, [Validators.required, Validators.minLength(6)]],
            area_id: [+this.data.client.area_id, [Validators.required]],
            landline: [this.data.client.landline, []],
            website: [this.data.client.website, []]
        });

        this.clientForm2 = this._formBuilder.group({
            address_1: [this.data.client.address_1, [Validators.required]],
            address_2: [this.data.client.address_2, []],
            city: [this.data.client.city, [Validators.required]],
            pincode: [this.data.client.pincode, [Validators.required]],
            state: [this.data.client.state, [Validators.required]],
            country: [this.data.client.country, [Validators.required]]
        });

        this.clientForm3 = this._formBuilder.group({
            name_1: [this.data.client.name_1, [Validators.required]],
            name_2: [this.data.client.name_2, []],
            phone_1: [this.data.client.phone_1, [Validators.required]],
            phone_2: [this.data.client.phone_2, []]
        });
    }

    getIndustryType(){
        this.loading = true;
        this.falconService.getIndustryType()
        .subscribe((result) => {
            this.getArea();
            this.industryTypes = result;
            //this.loading = false;
        },
        (error) => {
            this.getArea();
            this.openSnackBar('Failed to Load Industry Type');
            //this.loading = false;
            //this.getIndustryType();
        });
    }

    getArea(){
        this.loading = true;
        this.falconService.getArea()
        .subscribe((result) => {
            this.areas = result;
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load Areas');
            this.loading = false;
        });
    }

    // passwordChange(){
    //     if(this.clientForm1.get('password').value != this.clientForm1.get('confirm_password').value){
    //       this.passwordMatch = false;
    //     }
    //     else{
    //       this.passwordMatch = true;
    //     }
    // }

    changePasswordVisibility(flag){
        this.showPassword = flag;
    }

    changeConfirmPasswordVisibility(flag){
        this.showConfirmPassword = flag;
    }

    onRegister(){
        this.loading = true;
        var userId = localStorage.getItem('userId');
        this.clientForm = new OrganisationMaster();
        this.clientForm.id = this.data.id;
        this.clientForm.org_id = +userId;
        this.clientForm.organisation_name = this.clientForm1.get('organisation_name').value;
        this.clientForm.industry_type = this.clientForm1.get('industry_type').value;
        this.clientForm.email = this.clientForm1.get('email').value;
        this.clientForm.gst_no = this.clientForm1.get('gst_no').value;
        this.clientForm.password = this.clientForm1.get('password').value;
        this.clientForm.area_id = +this.clientForm1.get('area_id').value;
        this.clientForm.landline = this.clientForm1.get('landline').value;
        this.clientForm.website = this.clientForm1.get('website').value;
        this.clientForm.address_1 = this.clientForm2.get('address_1').value;
        this.clientForm.address_2 = this.clientForm2.get('address_2').value;
        this.clientForm.city = this.clientForm2.get('city').value;
        this.clientForm.pincode = this.clientForm2.get('pincode').value;
        this.clientForm.state = this.clientForm2.get('state').value;
        this.clientForm.country = this.clientForm2.get('country').value;
        this.clientForm.name_1 = this.clientForm3.get('name_1').value;
        this.clientForm.phone_1 = this.clientForm3.get('phone_1').value;
        this.clientForm.name_2 = this.clientForm3.get('name_2').value;
        this.clientForm.phone_2 = this.clientForm3.get('phone_2').value;

        this.addClient(this.clientForm);

    }

    addClient(data){
        this.loading = true;

        if(this.data.id == 0){
            this.falconService.addClient(data)
            .subscribe((result) => {
                this.openSnackBar('Client successfuly Added');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Add Client');
                this.loading = false;
            });
        }
        else{
            this.falconService.editClient(data)
            .subscribe((result) => {
                this.openSnackBar('Client successfuly Edited');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Edit Client');
                this.loading = false;
            });
        }
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
    }

  }