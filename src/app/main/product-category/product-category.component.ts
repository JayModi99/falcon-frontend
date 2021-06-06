import { Router } from '@angular/router';
import { FalconService } from './../../service/falcon.service';
import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';

export interface DialogData {
    type: string;
    id: number;
    product_category: string;
    description: string;
  }

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProductCategoryComponent implements OnInit {

    dataLoading: boolean = true;
    dataRefreshing: boolean = false;
    loading: boolean = false;
    failed: boolean = false;

    productCategory: any = [];
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
        private snackBar: MatSnackBar,
        private router: Router
    ){ 
        this.titleService.setTitle("Falcon - Product Category");
    }

    ngOnInit(){
        // For showing localstorage data while data
        // this.productCategory = JSON.parse(window.localStorage.getItem('productCategory'));
        this.getProductCategory();
    }

    // For showing localstorage data while data
    // @HostListener('window:storage', ['$event'])
    // onStorageChange(event) {
    //     if(event.key == 'productCategory'){
    //         var pC: any = JSON.parse(event.newValue)
    //         console.log(pC);
    //         if(this.productCategory != pC){
    //             this.offset = 0;
    //             this.infiniteScrollLoading = false;
    //             this.isInfiniteScrollDisabled = false;
    //             this.productCategory = [];
    //             this.getProductCategory();
    //         }
    //     }    
    // }

    getProductCategory(){
        // For showing localstorage data while data
        // if(this.productCategory != null && this.productCategory != '' && !this.infiniteScrollLoading){
        //     this.dataRefreshing = true;
        //     this.openSnackBar('Refreshing...', '', 0, 'right', 'bottom');
        // }
        this.dataLoading = true;
        this.failed = false;
        var s;
        if(this.search == ''){
            s = 'null';
        }
        else{
            s = this.search;
        }
        this.falconService.getAllProductCategoryByFilters(s, this.orderBy, this.order, this.offset)
        .subscribe((result:any) => {
            result.data.forEach(element => {
                this.productCategory.push(element);
            });
            this.totalRows = result.totalRows;
            this.offset += result.data.length;
            this.isInfiniteScrollDisabled = false;
            if(this.offset >= result.totalRows){
                this.isInfiniteScrollDisabled = true;
            }
            this.infiniteScrollLoading = false;
            // For showing localstorage data while data
            // var pC: any = JSON.parse(window.localStorage.getItem('productCategory'));
            // if(pC == null || pC == '' || !pC){
            //     pC = [];
            // }
            // if(this.productCategory != pC && this.search == '' && this.orderBy == 'id' && this.order == 'asc' && this.offset <= 15)
            // {
            //     localStorage.setItem('productCategory', JSON.stringify(this.productCategory));
            // }
            this.dataLoading = false;
            // this.dataRefreshing = false;
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

    // getProductCategory(){
    //     if(this.productCategory != null && this.productCategory != ''){
    //         this.openSnackBar('Refreshing...', '', 0, 'right', 'bottom');
    //     }
    //     this.dataLoading = true;
    //     this.failed = false;
    //     this.falconService.getProductCategory()
    //     .subscribe((result) => {
    //         console.log('done');
    //         this.dataLoading = false;
    //         this.snackBar.dismiss();
    //         if(result != JSON.parse(window.localStorage.getItem('productCategory')))
    //         {
    //             this.productCategory = result;
    //             localStorage.setItem('productCategory', JSON.stringify(this.productCategory));
    //         }
    //     },
    //     (error) => {
    //         this.snackBar.dismiss();
    //         this.openSnackBar('Failed to load', 'Close', 3000, 'center', 'bottom');
    //         this.dataLoading = false;
    //         this.failed = true;
    //     });
    // }

    openAddDialog(type, id, product_category, description) {
        if(this.dataRefreshing && type == 'Edit'){
            this.openSnackBar("Can't edit while refreshing", 'Close', 3000, 'center', 'bottom');
        }
        else{
            const dialogRef = this.dialog.open(AddProductCategoryDialog, {
                disableClose: true, 
                autoFocus: false,
                data: {
                    type: type,
                    id: id,
                    product_category: product_category,
                    description: description
                }
            });
        
            dialogRef.afterClosed().subscribe(result => {
                if(result != 0){
                    this.offset = 0;
                    this.infiniteScrollLoading = false;
                    this.isInfiniteScrollDisabled = false;
                    this.productCategory = [];
                    this.getProductCategory();
                }
            });
        }
    }

    deleteProductCategory(id, index){
        if(this.dataRefreshing){
            this.openSnackBar("Can't delete while refreshing", 'Close', 3000, 'center', 'bottom');
        }
        else{
            const dialogRef = this.dialog.open(DeleteDialog, {
                disableClose: true, 
                autoFocus: false
            });
        
            dialogRef.afterClosed().subscribe(result => {
                if(result == 1){
                    this.loading = true;
                    this.falconService.deleteProductCategory(id)
                    .subscribe((result) => {
                        if(result == 'Product Category is linked'){
                            this.openSnackBar('Product Category is linked', 'Close', 3000, 'center', 'bottom');
                            this.loading = false;
                        }
                        else{
                            this.openSnackBar('Product Category Deleted', 'Close', 3000, 'center', 'bottom');
                            this.loading = false;
                            this.productCategory.splice(index, 1);
                            this.offset--;
                            this.totalRows--;
                            localStorage.setItem('productCategory', JSON.stringify(this.productCategory));
                        }
                    },
                    (error) => {
                        this.openSnackBar('Failed to Delete', 'Close', 3000, 'center', 'bottom');
                        this.loading = false;
                    });
                }
            });
        }
    }

    resetFilters(){
        if(!this.dataLoading && !this.dataRefreshing){
            this.dataLoading = true;
            this.productCategory = [];
            this.search = '';
            this.orderBy = 'id';
            this.order = 'asc';
            this.offset = null;
            this.totalRows = null;
            this.getProductCategory();
        }
        else if(this.dataLoading){
            this.openSnackBar("Can't reset while loading", 'Close', 3000, 'center', 'bottom');
        }
        else if(this.dataRefreshing){
            this.openSnackBar("Can't reset while refreshing", 'Close', 3000, 'center', 'bottom');
        }
    }

    onSearch(search){
        if(!this.dataLoading && !this.dataRefreshing){
            this.dataLoading = true;
            this.productCategory = [];
            this.search = search;
            this.offset = null;
            this.totalRows = null;
            this.getProductCategory();
        }
        else if(this.dataLoading){
            this.openSnackBar("Can't search while loading", 'Close', 3000, 'center', 'bottom');
        }
        else if(this.dataRefreshing){
            this.openSnackBar("Can't search while refreshing", 'Close', 3000, 'center', 'bottom');
        }
    }

    onColumnSort(columnName){
        if(!this.dataLoading && !this.dataRefreshing){
            this.dataLoading = true;
            this.productCategory = [];
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
            this.getProductCategory();
        }
        else if(this.dataLoading){
            this.openSnackBar("Can't sort while loading", 'Close', 3000, 'center', 'bottom');
        }
        else if(this.dataRefreshing){
            this.openSnackBar("Can't sort while refreshing", 'Close', 3000, 'center', 'bottom');
        }
    }

    onScroll(){
        if(this.isInfiniteScrollDisabled == false){
            this.isInfiniteScrollDisabled = true;
            this.infiniteScrollLoading = true;
            this.getProductCategory();
        }
    }

    // openSnackBar(message: string) {
    //     this.snackBar.open(message, 'Close', {
    //       duration: 3000,
    //     });
    // }

    openSnackBar(message, close, duration, horizontalPosition: MatSnackBarHorizontalPosition, verticalPosition: MatSnackBarVerticalPosition) {
        this.snackBar.open(message, close, {
            duration: duration,
            horizontalPosition: horizontalPosition,
            verticalPosition: verticalPosition,
        });
    }
}

@Component({
    selector: 'add-product-category-dialog',
    templateUrl: 'add-product-category-dialog.html',
    styleUrls: ['./product-category.component.scss']
  })
  export class AddProductCategoryDialog {

    productCategoryForm: FormGroup;

    loading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<AddProductCategoryDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar
    ){ }

    ngOnInit(): void
    {
        this.productCategoryForm = this._formBuilder.group({
            product_category: [this.data.product_category, [Validators.required]],
            description: [this.data.description, [Validators.required]]
        });
    }

    addProductCategory(){
        this.loading = true;

        var data = {
            id: this.data.id,
            org_id: localStorage.getItem('userId'),
            product_category: this.productCategoryForm.get('product_category').value,
            description: this.productCategoryForm.get('description').value,
            created_by: localStorage.getItem('userId')
        };

        if(this.data.id == 0){
            this.falconService.addProductCategory(data)
            .subscribe((result) => {
                this.openSnackBar('Product Category successfuly added');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to add');
                this.loading = false;
            });
        }
        else{
            this.falconService.editProductCategory(data)
            .subscribe((result) => {
                this.openSnackBar('Product Category successfuly edited');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to edit');
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

