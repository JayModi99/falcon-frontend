import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FalconService } from 'app/service/falcon.service';
import { AddAreaDialog } from '../areas/areas.component';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';
import { AddProblemDialog } from '../problem/problem.component';

export interface DialogData {
    type: string;
    id: number;
    engineer: any;
}

@Component({
  selector: 'app-engineer',
  templateUrl: './engineer.component.html',
  styleUrls: ['./engineer.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class EngineerComponent implements OnInit {

    dataLoading: boolean = true;
    loading: boolean = false;
    failed: boolean = false;

    engineer: any = [];
    search = '';
    orderBy = 'id';
    order = 'asc';
    offset = 0;
    totalRows: number;
    infiniteScrollLoading: boolean = false;
    isInfiniteScrollDisabled: boolean = false;

    constructor(
        private titleService: Title,
        private falconService: FalconService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ){ 
        this.titleService.setTitle("Falcon - Engineer");
    }

    ngOnInit(){
        this.getEngineer();
    }

    refresh(){
        this.dataLoading = true;
        this.getEngineer();
    }

     getEngineer(){
        this.failed = false;
        var s;
        if(this.search == ''){
            s = 'null';
        }
        else{
            s = this.search;
        }
        this.falconService.getAllEngineerByFilters(s, this.orderBy, this.order, this.offset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.engineer.push(element);
            });
            this.totalRows = result.totalRows;
            this.offset += result.data.length;
            this.isInfiniteScrollDisabled = false;
            if(this.offset >= result.totalRows){
                this.isInfiniteScrollDisabled = true;
            }
            this.infiniteScrollLoading = false;
            this.dataLoading = false;
            this.snackBar.dismiss();
        },
        (error) => {
            this.snackBar.dismiss();
            this.openSnackBar('Failed to load', 'Close', 3000, 'center', 'bottom');
            this.dataLoading = false;
            this.failed = true;
            this.infiniteScrollLoading = false;
        });
    }

    openEngineerAddDialog(type, id, engineer) {
        const dialogRef = this.dialog.open(AddEngineerDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                engineer: engineer
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.offset = 0;
                this.infiniteScrollLoading = false;
                this.isInfiniteScrollDisabled = false;
                this.engineer = [];
                this.getEngineer();
            }
        });
    }

    deleteEngineer(id, index){
        const dialogRef = this.dialog.open(DeleteDialog, {
            disableClose: true, 
            autoFocus: false
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == 1){
                this.loading = true;
                this.falconService.deleteEngineer(id)
                .subscribe((result: any) => {
                    if(result == 'Engineer is linked'){
                        this.loading = false;
                        this.openSnackBar('Failed to Delete! Engineer is linked', 'Close', 3000, 'center', 'bottom');
                    }
                    else{
                        this.openSnackBar('Engineer Deleted', 'Close', 3000, 'center', 'bottom');
                        this.engineer.splice(index, 1);
                        this.offset--;
                        this.totalRows--;
                        this.loading = false;
                    }
                },
                (error) => {
                    this.openSnackBar('Failed to Delete', 'Close', 3000, 'center', 'bottom');
                    this.loading = false;
                });
            }
        });
    }

    resetFilters(){
        if(!this.dataLoading && !this.infiniteScrollLoading){
            this.dataLoading = true;
            this.engineer = [];
            this.search = '';
            this.orderBy = 'id';
            this.order = 'asc';
            this.offset = null;
            this.totalRows = null;
            this.getEngineer();
        }
        else{
            this.openSnackBar("Can't reset while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onSearch(search){
        if(!this.dataLoading && !this.infiniteScrollLoading){
            this.dataLoading = true;
            this.engineer = [];
            this.search = search;
            this.offset = null;
            this.totalRows = null;
            this.getEngineer();
        }
        else{
            this.openSnackBar("Can't search while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onColumnSort(columnName){
        if(!this.dataLoading && !this.infiniteScrollLoading){
            this.dataLoading = true;
            this.engineer = [];
            this.offset = null;
            this.totalRows = null;
            if(this.orderBy == columnName){
                if(this.order == 'asc'){
                    this.order = 'desc';
                }
                else{
                    this.order = 'asc';
                }
            }
            else{
                this.order = 'asc';
            }
            this.orderBy = columnName;
            this.getEngineer();
        }
        else{
            this.openSnackBar("Can't sort while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onScroll(){
        if(this.isInfiniteScrollDisabled == false){
            this.isInfiniteScrollDisabled = true;
            this.infiniteScrollLoading = true;
            this.getEngineer();
        }
    }

    openSnackBar(message, close, duration, horizontalPosition: MatSnackBarHorizontalPosition, verticalPosition: MatSnackBarVerticalPosition) {
        this.snackBar.open(message, close, {
            duration: duration,
            horizontalPosition: horizontalPosition,
            verticalPosition: verticalPosition,
        });
    }

}

@Component({
    selector: 'add-engineer-dialog',
    templateUrl: 'add-engineer-dialog.html'
  })
  export class AddEngineerDialog {

    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    passwordMatch: boolean = true;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    engineerForm: FormGroup;
    areas;
    problems;
    eArea: Array<number> = [];
    eProblem: Array<number> = [];

    loading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<AddEngineerDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog
    ){ }

    ngOnInit(): void
    {
        this.getArea();
        this.getProblem();
        if(this.data.id != 0){
            this.getAreaOfEngineer();
        }

        this.engineerForm = this._formBuilder.group({
            name: [this.data.engineer.name, [Validators.required]],
            email: [this.data.engineer.email, [Validators.required, Validators.pattern(this.emailPattern)]],
            password: [this.data.engineer.password, [Validators.required]],
            confirm_password: [this.data.engineer.password, []],
            address_1: [this.data.engineer.address_1, [Validators.required]],
            address_2: [this.data.engineer.address_2, []],
            city: [this.data.engineer.city, [Validators.required]],
            pincode: [this.data.engineer.pincode, [Validators.required]],
            state: [this.data.engineer.state, [Validators.required]],
            country: [this.data.engineer.country, [Validators.required]],
            area_id: [this.eArea, [Validators.required]],
            problem_id: [this.eProblem, [Validators.required]],
        });
    }

    passwordChange(){
        if(this.engineerForm.get('password').value != this.engineerForm.get('confirm_password').value){
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

    getArea(){
        this.loading = true;
        this.falconService.getArea()
        .subscribe((result) => {
            this.areas = result;
        },
        (error) => {
            this.openSnackBar('Failed to load Area');
        });
    }

    getProblem(){
        this.loading = true;
        this.falconService.getProblem()
        .subscribe((result) => {
            this.problems = result;
            if(this.data.id == 0){
                this.loading = false;
            }
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load Problems');
            if(this.data.id == 0){
                this.loading = false;
            }
            this.loading = false;
        });
    }

    getAreaOfEngineer(){
        this.loading = true;
        this.falconService.getAreaOfEngineer(this.data.id)
        .subscribe((result: any) => {
            result.forEach((element, index) => {
                this.eArea[index] = +element.area_id;
            });
            this.getProblemOfEngineer();
        },
        (error) => {
            this.getProblemOfEngineer();
            this.openSnackBar('Failed to load Areas of Engineer');
        });
    }

    getProblemOfEngineer(){
        this.loading = true;
        this.falconService.getProblemOfEngineer(this.data.id)
        .subscribe((result: any) => {
            result.forEach((element, index) => {
                this.eProblem[index] = +element.problem_id;
            });
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load Problems of Engineer');
            this.loading = false;
        },
        () => {
            this.engineerForm = this._formBuilder.group({
                name: [this.data.engineer.name, [Validators.required]],
                email: [this.data.engineer.email, [Validators.required, Validators.pattern(this.emailPattern)]],
                password: [this.data.engineer.password, [Validators.required]],
                confirm_password: [this.data.engineer.password, []],
                address_1: [this.data.engineer.address_1, [Validators.required]],
                address_2: [this.data.engineer.address_2, []],
                city: [this.data.engineer.city, [Validators.required]],
                pincode: [this.data.engineer.pincode, [Validators.required]],
                state: [this.data.engineer.state, [Validators.required]],
                country: [this.data.engineer.country, [Validators.required]],
                area_id: [this.eArea, [Validators.required]],
                problem_id: [this.eProblem, [Validators.required]],
            });
        });
    }

    openAreaAddDialog(type, id, name) {
        const dialogRef = this.dialog.open(AddAreaDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                name: name
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.areas.length = 0;
                this.getArea();
            }
        });
    }

    openProblemAddDialog(type, id, problem_name, description) {
        const dialogRef = this.dialog.open(AddProblemDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                problem_name: problem_name,
                description: description
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.problems.length = 0;
                this.getProblem();
            }
        });
    }

    addEngineer(){
        this.loading = true;

        var data = {
            id: this.data.id,
            org_id: localStorage.getItem('userId'),
            name: this.engineerForm.get('name').value,
            email: this.engineerForm.get('email').value,
            password: this.engineerForm.get('password').value,
            address_1: this.engineerForm.get('address_1').value,
            address_2: this.engineerForm.get('address_2').value,
            city: this.engineerForm.get('city').value,
            pincode: this.engineerForm.get('pincode').value,
            state: this.engineerForm.get('state').value,
            country: this.engineerForm.get('country').value,
            created_by: localStorage.getItem('userId'),
            area_id: this.engineerForm.get('area_id').value,
            problem_id: this.engineerForm.get('problem_id').value
        };

        if(this.data.id == 0){
            this.falconService.addEngineer(data)
            .subscribe((result) => {
                this.openSnackBar('Engineer successfuly Added');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Add Engineer');
                this.loading = false;
            });
        }
        else{
            this.falconService.editEngineer(data)
            .subscribe((result) => {
                this.openSnackBar('Engineer successfuly Edited');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Edit Engineer');
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
