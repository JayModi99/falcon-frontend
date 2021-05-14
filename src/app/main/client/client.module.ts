import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClientDialog, ClientComponent } from './client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
            RouterModule,
            FormsModule,
            ReactiveFormsModule,

            MatButtonModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            MatStepperModule,
            MatSelectModule,
            MatProgressSpinnerModule,
            MatSnackBarModule,
            MatDialogModule,

            FuseSharedModule
    ],
    declarations: [
        ClientComponent,
        AddClientDialog
    ],
    entryComponents: [
        AddClientDialog
    ]
})
export class ClientModule { }
