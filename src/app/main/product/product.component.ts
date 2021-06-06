import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { FalconService } from 'app/service/falcon.service';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';
import { AddProductCategoryDialog } from 'app/main/product-category/product-category.component';
import { fuseAnimations } from '@fuse/animations';

export interface DialogData {
    type: string;
    id: number;
    category_id: number;
    name: string;
    description: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {

    dataLoading: boolean = true;
    loading: boolean = false;
    failed: boolean = false;

    products: any = [];
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
        this.titleService.setTitle("Falcon - Product");
    }

    ngOnInit(){
        this.getProduct();
    }

    refresh(){
        this.dataLoading = true;
        this.getProduct();
    }

    getProduct(){
        this.failed = false;
        var s;
        if(this.search == ''){
            s = 'null';
        }
        else{
            s = this.search;
        }
        this.falconService.getAllProductByFilters(s, this.orderBy, this.order, this.offset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.products.push(element);
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

    openAddDialog(type, id, category_id, name, description) {
        const dialogRef = this.dialog.open(AddProductDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                category_id: category_id,
                name: name,
                description: description
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.offset = 0;
                this.infiniteScrollLoading = false;
                this.isInfiniteScrollDisabled = false;
                this.products = [];
                this.getProduct();
            }
        });
    }

    deleteProduct(id, index){
        const dialogRef = this.dialog.open(DeleteDialog, {
            disableClose: true, 
            autoFocus: false
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == 1){
                this.loading = true;
                this.falconService.deleteProduct(id)
                .subscribe((result) => {
                    if(result == 'Product is linked'){
                        this.loading = false;
                        this.openSnackBar('Failed to Delete! Product is linked', 'Close', 3000, 'center', 'bottom');
                    }
                    else{
                        this.openSnackBar('Product Deleted', 'Close', 3000, 'center', 'bottom');
                        this.products.splice(index, 1);
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
            this.products = [];
            this.search = '';
            this.orderBy = 'id';
            this.order = 'asc';
            this.offset = null;
            this.totalRows = null;
            this.getProduct();
        }
        else{
            this.openSnackBar("Can't reset while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onSearch(search){
        if(!this.dataLoading && !this.infiniteScrollLoading){
            this.dataLoading = true;
            this.products = [];
            this.search = search;
            this.offset = null;
            this.totalRows = null;
            this.getProduct();
        }
        else{
            this.openSnackBar("Can't search while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onColumnSort(columnName){
        if(!this.dataLoading && !this.infiniteScrollLoading){
            this.dataLoading = true;
            this.products = [];
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
            this.getProduct();
        }
        else{
            this.openSnackBar("Can't sort while loading", 'Close', 3000, 'center', 'bottom');
        }
    }

    onScroll(){
        if(this.isInfiniteScrollDisabled == false){
            this.isInfiniteScrollDisabled = true;
            this.infiniteScrollLoading = true;
            this.getProduct();
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
    selector: 'add-product-dialog',
    templateUrl: 'add-product-dialog.html',
    styleUrls: ['./product.component.scss']
  })
  export class AddProductDialog {

    productForm: FormGroup;
    productCategory: any;
    loading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<AddProductDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog
    ){ }

    ngOnInit(): void
    {
        this.getProductCategory();
        this.productForm = this._formBuilder.group({
            name: [this.data.name, [Validators.required]],
            category_id: [this.data.category_id, [Validators.required]],
            description: [this.data.description, [Validators.required]]
        });
    }

    getProductCategory(){
        this.loading = true;
        this.falconService.getProductCategory()
        .subscribe((result) => {
            console.log(result);
            this.productCategory = result;
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.loading = false;
        });
    }

    openProductCategoryAddDialog() {
        const dialogRef = this.dialog.open(AddProductCategoryDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: 'Add',
                id: 0,
                product_category: '',
                description: ''
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.productCategory.length = 0;
                this.getProductCategory();
            }
        });
    }

    addProduct(){
        this.loading = true;

        var data = {
            id: this.data.id,
            org_id: localStorage.getItem('userId'),
            category_id: this.productForm.get('category_id').value,
            name: this.productForm.get('name').value,
            description: this.productForm.get('description').value,
            created_by: localStorage.getItem('userId')
        };

        if(this.data.id == 0){
            this.falconService.addProduct(data)
            .subscribe((result) => {
                this.openSnackBar('Product successfuly added');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to add');
                this.loading = false;
            });
        }
        else{
            this.falconService.editProduct(data)
            .subscribe((result) => {
                this.openSnackBar('Product successfuly edited');
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
