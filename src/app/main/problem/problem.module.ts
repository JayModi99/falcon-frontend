import { DeleteDialog } from 'app/main/dialog/delete-dialog/delete-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProblemDialog, ProblemComponent } from './problem.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComplaintModule } from '../complaint/complaint.module';

@NgModule({
    imports: [
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
    declarations: [
        ProblemComponent,
        AddProblemDialog,
        DeleteDialog
    ],
    entryComponents: [
        AddProblemDialog,
        DeleteDialog
    ]
})
export class ProblemModule { }
