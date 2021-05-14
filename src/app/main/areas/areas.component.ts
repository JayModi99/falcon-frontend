import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FalconService } from 'app/service/falcon.service';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';

export interface AreaDialogData {
    type: string;
    id: number;
    name: string;
  }

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AreasComponent implements OnInit {

    dataLoading: boolean = true;
    loading: boolean = false;
    failed: boolean = false;
    areas: any;

    constructor(
        private titleService: Title,
        private falconService: FalconService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ){ 
        this.titleService.setTitle("Falcon - Area");
    }

    ngOnInit(){
        this.getArea();
     }

    getArea(){
        this.dataLoading = true;
        this.failed = false;
        this.falconService.getArea()
        .subscribe((result) => {
            this.areas = result;
            this.dataLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.dataLoading = false;
            this.failed = true;
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

    deleteArea(id, index){
        const dialogRef = this.dialog.open(DeleteDialog, {
            disableClose: true, 
            autoFocus: false
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == 1){
                this.loading = true;
                this.falconService.deleteArea(id)
                .subscribe((result: any) => {
                    console.log(result);
                    if(result == 'Area is linked'){
                        this.loading = false;
                        this.openSnackBar('Failed to Delete! Area is Linked');
                    }
                    else{
                        this.openSnackBar('Area Deleted');
                        this.areas.splice(index, 1);
                        this.loading = false;
                    }
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
    selector: 'add-area-dialog',
    templateUrl: 'add-area-dialog.html'
  })
  export class AddAreaDialog {

    areaForm: FormGroup;

    loading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: AreaDialogData,
        public dialogRef: MatDialogRef<AddAreaDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar
    ){ }

    ngOnInit(): void
    {
        this.areaForm = this._formBuilder.group({
            name: [this.data.name, [Validators.required]]
        });
    }

    addArea(){
        this.loading = true;

        var data = {
            id: this.data.id,
            org_id: localStorage.getItem('userId'),
            name: this.areaForm.get('name').value,
            created_by: localStorage.getItem('userId')
        };

        if(this.data.id == 0){
            this.falconService.addArea(data)
            .subscribe((result) => {
                this.openSnackBar('Area successfuly Added');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Add Area');
                this.loading = false;
            });
        }
        else{
            this.falconService.editArea(data)
            .subscribe((result) => {
                this.openSnackBar('Area successfuly Edited');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Edit Area');
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
