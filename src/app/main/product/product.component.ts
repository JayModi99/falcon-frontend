import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { FalconService } from 'app/service/falcon.service';

export interface DialogData {
    type: string;
    id: number;
    product_category: string;
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
    productCategory: any;

    constructor(
        private titleService: Title,
        private falconService: FalconService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ){ 
        this.titleService.setTitle("Falcon - Product Category");
    }

    ngOnInit(){
        this.getProductCategory();
     }

    getProductCategory(){
        this.dataLoading = true;
        this.failed = false;
        this.falconService.getProductCategory()
        .subscribe((result) => {
            this.productCategory = result;
            this.dataLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.dataLoading = false;
            this.failed = true;
        });
    }

    openAddDialog(type, id, product_category, description) {
        const dialogRef = this.dialog.open(AddProductDialog, {
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
                this.productCategory = null;
                this.getProductCategory();
            }
        });
    }

    deleteProductCategory(id, index){
        this.loading = true;
        this.falconService.deleteProductCategory(id)
        .subscribe((result) => {
            this.openSnackBar('Product Category Deleted');
            this.loading = false;
            this.productCategory.splice(index, 1);
        },
        (error) => {
            this.openSnackBar('Failed to Delete');
            this.loading = false;
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

    productCategoryForm: FormGroup;

    loading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<AddProductDialog>,
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
