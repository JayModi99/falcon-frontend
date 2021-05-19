import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { FalconService } from 'app/service/falcon.service';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';
import { AddProductCategoryDialog } from 'app/main/product-category/product-category.component';

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
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    dataLoading: boolean = true;
    loading: boolean = false;
    failed: boolean = false;
    products: any;

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

    getProduct(){
        this.dataLoading = true;
        this.failed = false;
        this.falconService.getProduct()
        .subscribe((result) => {
            this.products = result;
            this.dataLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.dataLoading = false;
            this.failed = true;
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
                this.products = null;
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
                    this.openSnackBar('Product Deleted');
                    this.loading = false;
                    this.products.splice(index, 1);
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
