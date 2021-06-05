import { ComplaintModule } from './../complaint/complaint.module';
import { NgModule } from '@angular/core';
import { ProductCategoryComponent, AddProductCategoryDialog } from './product-category.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FuseWidgetModule } from '@fuse/components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
      ProductCategoryComponent,
      AddProductCategoryDialog
    ],
  imports     : [
    RouterModule,

    FuseSharedModule,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,

    FuseSharedModule,
    FuseWidgetModule,
    ComplaintModule
  ],
  exports     : [
      ProductCategoryComponent,
      AddProductCategoryDialog
  ],
  entryComponents: [
    AddProductCategoryDialog
  ]
})
export class ProductCategoryModule { }
