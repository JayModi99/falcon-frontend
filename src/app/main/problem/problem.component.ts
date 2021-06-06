import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FalconService } from 'app/service/falcon.service';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';

export interface DialogData {
    type: string;
    id: number;
    problem_name: string;
    description: string;
}

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProblemComponent implements OnInit {

    dataLoading: boolean = true;
    loading: boolean = false;
    failed: boolean = false;
    
    problem: any = [];
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
        this.titleService.setTitle("Falcon - Problem");
    }

    ngOnInit(){
        this.getProblem();
    }

    refresh(){
        this.dataLoading = true;
        this.getProblem();
    }

    getProblem(){
        this.failed = false;
        var s;
        if(this.search == ''){
            s = 'null';
        }
        else{
            s = this.search;
        }
        this.falconService.getAllProblemByFilters(s, this.orderBy, this.order, this.offset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.problem.push(element);
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
                this.offset = 0;
                this.infiniteScrollLoading = false;
                this.isInfiniteScrollDisabled = false;
                this.problem = [];
                this.getProblem();
            }
        });
    }

    deleteProblem(id, index){
        const dialogRef = this.dialog.open(DeleteDialog, {
            disableClose: true, 
            autoFocus: false
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == 1){
                this.loading = true;
                this.falconService.deleteProblem(id)
                .subscribe((result: any) => {
                    if(result == 'Problem is linked'){
                        this.loading = false;
                        this.openSnackBar('Failed to Delete! Problem is linked', 'Close', 3000, 'center', 'bottom');
                    }
                    else{
                        this.openSnackBar('Problem Deleted', 'Close', 3000, 'center', 'bottom');
                        this.problem.splice(index, 1);
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
            this.problem = [];
            this.search = '';
            this.orderBy = 'id';
            this.order = 'asc';
            this.offset = null;
            this.totalRows = null;
            this.getProblem();
        }
        else{
            this.openSnackBar("Can't reset while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onSearch(search){
        if(!this.dataLoading && !this.infiniteScrollLoading){
            this.dataLoading = true;
            this.problem = [];
            this.search = search;
            this.offset = null;
            this.totalRows = null;
            this.getProblem();
        }
        else{
            this.openSnackBar("Can't search while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onColumnSort(columnName){
        if(!this.dataLoading && !this.infiniteScrollLoading){
            this.dataLoading = true;
            this.problem = [];
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
            this.getProblem();
        }
        else{
            this.openSnackBar("Can't sort while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onScroll(){
        if(this.isInfiniteScrollDisabled == false){
            this.isInfiniteScrollDisabled = true;
            this.infiniteScrollLoading = true;
            this.getProblem();
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
    selector: 'add-problem-dialog',
    templateUrl: 'add-problem-dialog.html'
  })
  export class AddProblemDialog {

    problemForm: FormGroup;

    loading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<AddProblemDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar
    ){ }

    ngOnInit(): void
    {
        this.problemForm = this._formBuilder.group({
            problem_name: [this.data.problem_name, [Validators.required]],
            description: [this.data.description, [Validators.required]]
        });
    }

    addProblem(){
        this.loading = true;

        var data = {
            id: this.data.id,
            org_id: localStorage.getItem('userId'),
            problem_name: this.problemForm.get('problem_name').value,
            description: this.problemForm.get('description').value,
            created_by: localStorage.getItem('userId')
        };

        if(this.data.id == 0){
            this.falconService.addProblem(data)
            .subscribe((result) => {
                this.openSnackBar('Problem successfuly Added');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Add Problem');
                this.loading = false;
            });
        }
        else{
            this.falconService.editProblem(data)
            .subscribe((result) => {
                this.openSnackBar('Problem successfuly Edited');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Edit Problem');
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
