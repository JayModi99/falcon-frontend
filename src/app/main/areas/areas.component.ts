import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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

    areas: any = [];
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
        this.titleService.setTitle("Falcon - Area");
    }

    ngOnInit(){
        this.getArea();
     }

    getArea(){
        this.dataLoading = true;
        this.failed = false;
        var s;
        if(this.search == ''){
            s = 'null';
        }
        else{
            s = this.search;
        }
        this.falconService.getAllAreaByFilters(s, this.orderBy, this.order, this.offset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.areas.push(element);
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
                this.offset = 0;
                this.infiniteScrollLoading = false;
                this.isInfiniteScrollDisabled = false;
                this.areas = [];
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
                    if(result == 'Area is linked'){
                        this.loading = false;
                        this.openSnackBar('Failed to Delete! Area is Linked', 'Close', 3000, 'center', 'bottom');
                    }
                    else{
                        this.openSnackBar('Area Deleted', 'Close', 3000, 'center', 'bottom');
                        this.areas.splice(index, 1);
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
        if(!this.dataLoading){
            this.dataLoading = true;
            this.areas = [];
            this.search = '';
            this.orderBy = 'id';
            this.order = 'asc';
            this.offset = null;
            this.totalRows = null;
            this.getArea();
        }
        else if(this.dataLoading){
            this.openSnackBar("Can't reset while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onSearch(search){
        if(!this.dataLoading){
            this.dataLoading = true;
            this.areas = [];
            this.search = search;
            this.offset = null;
            this.totalRows = null;
            this.getArea();
        }
        else if(this.dataLoading){
            this.openSnackBar("Can't search while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onColumnSort(columnName){
        if(!this.dataLoading){
            this.dataLoading = true;
            this.areas = [];
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
            this.getArea();
        }
        else if(this.dataLoading){
            this.openSnackBar("Can't sort while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onScroll(){
        if(this.isInfiniteScrollDisabled == false){
            this.isInfiniteScrollDisabled = true;
            this.infiniteScrollLoading = true;
            this.getArea();
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
