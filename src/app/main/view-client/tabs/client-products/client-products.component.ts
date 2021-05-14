import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialog } from 'app/main/dialog/delete-dialog/delete-dialog.component';
import { AddProductCategoryDialog } from 'app/main/product-category/product-category.component';
import { AddProductDialog } from 'app/main/product/product.component';
import { FalconService } from 'app/service/falcon.service';

export class ClientProduct {
    category_id: number;
    product_id: number;
    contract_type: string;
    contract_start;
    contract_end;
    details: string;
}

export interface ClientProductDialogData {
    type: string;
    id: number;
    clientProduct: ClientProduct;
    client_id: number;
}

@Component({
  selector: 'client-products',
  templateUrl: './client-products.component.html',
  styleUrls: ['./client-products.component.scss']
})
export class ClientProductsComponent implements OnInit {

    @Input()
    clientId: number;

    loading: boolean = false;
    dataLoading: boolean = false;
    failed: boolean = false;

    clientProducts: any;

    constructor(
        public dialog: MatDialog,
        private falconService: FalconService,
        private snackBar: MatSnackBar
    ) {
        this.falconService.getUpdate().subscribe
            (message => { 
                if(message.text == 'Reload Client Products'){
                    this.clientProducts.length = 0;
                    this.getClientProduct();
                }
        });
     }

    ngOnInit() {
        this.getClientProduct();
    }

    getClientProduct(){
        this.dataLoading = true;
        this.failed = false;
        this.falconService.getClientProduct(this.clientId)
        .subscribe((result) => {
            this.clientProducts = result;
            this.dataLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.dataLoading = false;
            this.failed = true;
        });
    }

    openClientProductAddDialog(type, id, clientProduct, clientId) {
        const dialogRef = this.dialog.open(AddClientProductDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                clientProduct: clientProduct,
                client_id: clientId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.clientProducts.length = 0;
                this.getClientProduct();
            }
        });
    }

    deleteClientProduct(id, index){
        const dialogRef = this.dialog.open(DeleteDialog, {
            disableClose: true, 
            autoFocus: false
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == 1){
                this.loading = true;
                this.falconService.deleteClientProduct(id)
                .subscribe((result: any) => {
                    this.openSnackBar('Client\'s Product Deleted');
                    this.clientProducts.splice(index, 1);
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
    selector: 'add-client-product-dialog',
    templateUrl: 'add-client-product-dialog.html'
  })
  export class AddClientProductDialog {

    clientProductForm: FormGroup;

    productCategory: any;
    product: any;

    loading: boolean = false;
    productFailed: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ClientProductDialogData,
        public dialogRef: MatDialogRef<AddClientProductDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog
    ){ }

    ngOnInit(): void
    {
        this.getProductCategory();
        this.clientProductForm = this._formBuilder.group({
            category_id: [this.data.clientProduct.category_id, [Validators.required]],
            product_id: [this.data.clientProduct.product_id, [Validators.required]],
            contract_type: [this.data.clientProduct.contract_type, [Validators.required]],
            contract_start: [this.data.clientProduct.contract_start, [Validators.required]],
            contract_end: [this.data.clientProduct.contract_end, [Validators.required]],
            details: [this.data.clientProduct.details, [Validators.required]]
        });
        if(this.data.type == 'Edit'){
            this.onProductCategoryChange(this.data.clientProduct.category_id);
        }
        else{
            this.clientProductForm.get('product_id').disable();
        }
        if(this.data.clientProduct.contract_type == 'Non Warranty'){
            this.clientProductForm.get('contract_start').disable();
            this.clientProductForm.get('contract_end').disable();
        }
    }

    getProductCategory(){
        this.loading = true;
        this.falconService.getProductCategory()
        .subscribe((result) => {
            this.productCategory = result;
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load Product Category');
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

    onProductCategoryChange(cId){
        this.clientProductForm.get('product_id').enable();
        this.getProductByCategoryId(cId);
    }

    getProductByCategoryId(cId){
        this.loading = true;
        this.productFailed = false;
        this.falconService.getProductByCategoryId(cId)
        .subscribe((result) => {
            this.product = result;
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load Products');
            this.loading = false;
            this.productFailed = true;
        });
    }

    openProductAddDialog() {
        const dialogRef = this.dialog.open(AddProductDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: 'Add',
                id: 0,
                name: '',
                category_id: '',
                description: ''
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.product = '';
                this.getProductByCategoryId(this.clientProductForm.get('category_id').value);
            }
        });
    }

    contractTypeChange(){
        if(this.clientProductForm.get('contract_type').value == 'Warranty'){
            this.clientProductForm.get('contract_start').enable();
            this.clientProductForm.get('contract_end').enable();
        }
        else if(this.clientProductForm.get('contract_type').value == 'Non Warranty'){
            this.clientProductForm.get('contract_start').disable();
            this.clientProductForm.get('contract_end').disable();
            this.clientProductForm.get('contract_start').setValue('');
            this.clientProductForm.get('contract_end').setValue('');
        }
        else if(this.clientProductForm.get('contract_type').value == 'AMC'){
            this.clientProductForm.get('contract_start').enable();
            this.clientProductForm.get('contract_end').enable();
        }
    }

    addClientProduct(){
        this.loading = true;

        var data = {
            id: this.data.id,
            org_id: localStorage.getItem('userId'),
            client_id: this.data.client_id,
            product_id: this.clientProductForm.get('product_id').value,
            contract_type: this.clientProductForm.get('contract_type').value,
            contract_start: this.clientProductForm.get('contract_start').value,
            contract_end: this.clientProductForm.get('contract_end').value,
            details: this.clientProductForm.get('details').value,
            created_by: localStorage.getItem('userId')
        };
        if(this.data.id == 0){
            this.falconService.addClientProduct(data)
            .subscribe((result) => {
                this.openSnackBar('Product successfuly Added');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                console.log(error);
                this.openSnackBar('Failed to Add Product');
                this.loading = false;
            });
        }
        else{
            this.falconService.editClientProduct(data)
            .subscribe((result) => {
                this.openSnackBar('Product successfuly Edited');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Edit Product');
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
