import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    problem: any;

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

    getProblem(){
        this.dataLoading = true;
        this.failed = false;
        this.falconService.getProblem()
        .subscribe((result) => {
            this.problem = result;
            this.dataLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.dataLoading = false;
            this.failed = true;
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
                this.problem.length = 0;
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
                    this.openSnackBar('Problem Deleted');
                    this.problem.splice(index, 1);
                    this.loading = false;
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
