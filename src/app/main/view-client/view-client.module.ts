import { ClientTicketsComponent, AddTicketDialog } from './tabs/client-tickets/client-tickets.component';
import { AddClientProductDialog, ClientProductsComponent } from './tabs/client-products/client-products.component';
import { ClientProfileComponent } from './tabs/client-profile/client-profile.component';
import { NgModule } from '@angular/core';
import { ViewClientComponent } from './view-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';

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
    MatTabsModule,
    MatDatepickerModule,

    FuseSharedModule
  ],
  declarations: [
      ViewClientComponent,
      ClientProfileComponent,
      ClientProductsComponent,
      ClientTicketsComponent,
      AddClientProductDialog,
      AddTicketDialog
    ],
    entryComponents: [
        AddClientProductDialog,
        AddTicketDialog
    ]
})
export class ViewClientModule { }
