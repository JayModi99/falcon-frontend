import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddClientDialog } from 'app/main/client/client.component';
import { DeleteDialog } from 'app/main/dialog/delete-dialog/delete-dialog.component';
import { AddProblemDialog } from 'app/main/problem/problem.component';
import { OrganisationMaster } from 'app/model/OrganisationMaster';
import { FalconService } from 'app/service/falcon.service';
import { AddClientProductDialog } from '../client-products/client-products.component';

export interface TicketDialogData {
    type: string;
    id: number;
    ticket: any;
    client_id: number;
}

@Component({
  selector: 'client-tickets',
  templateUrl: './client-tickets.component.html',
  styleUrls: ['./client-tickets.component.scss']
})
export class ClientTicketsComponent implements OnInit {

    @Input()
    clientId: number;

    tickets: any;
    engineers: any;

    loading: boolean = false;
    dataLoading: boolean = false;
    failed: boolean = false;

    constructor(
        public dialog: MatDialog,
        private falconService: FalconService,
        private snackBar: MatSnackBar
    ) { 
        this.falconService.getUpdate().subscribe
            (message => { 
                if(message.text == 'Reload Ticket'){
                    this.tickets.length = 0;
                    this.getTicket();
                }
        });
     }

    ngOnInit() {
        this.getTicket();
        this.getEngineer();
    }

    getTicket(){
        this.dataLoading = true;
        this.failed = false;
        this.falconService.getTicket(this.clientId)
        .subscribe((result) => {
            this.tickets = result;
            this.dataLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.dataLoading = false;
            this.failed = true;
        });
    }

    getEngineer(){
        this.falconService.getEngineer()
        .subscribe((result) => {
            this.engineers = result;
        },
        (error) => {
            this.openSnackBar('Failed to load');
        });
    }

    openTicketAddDialog(type, id, ticket, clientId) {
        const dialogRef = this.dialog.open(AddTicketDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                ticket: ticket,
                client_id: clientId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.tickets.length = 0;
                this.getTicket();
            }
        });
    }

    deleteTicket(id, index){
        const dialogRef = this.dialog.open(DeleteDialog, {
            disableClose: true, 
            autoFocus: false
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == 1){
                this.loading = true;
                this.falconService.deleteTicket(id)
                .subscribe((result: any) => {
                    this.openSnackBar('Ticket Deleted');
                    this.tickets.splice(index, 1);
                    this.loading = false;
                },
                (error) => {
                    this.openSnackBar('Failed to Delete');
                    this.loading = false;
                });
            }
        });
    }

    onAssignEngineerChange(event, index){
        this.loading = true;
        let data = {
            id: index,
            engineer_id: event.value,
            status: 1
        };
        this.falconService.assignEngineer(data)
        .subscribe((result) => {
            this.getTicket();
            this.openSnackBar('Engineer assigned successfuly');
            this.loading = false;
        },
        (error) => {
            this.loading = false;
            this.openSnackBar('Failed to assign engineer');
        });
    }

    ticketComplete(index){
        this.loading = true;
        let data = {
            'id': index,
            'status': 3
        };
        this.falconService.changeStatus(data)
        .subscribe((result) => {
            this.getTicket();
            this.openSnackBar('Status updated successfuly');
            this.loading = false;
        },
        (error) => {
            this.loading = false;
            this.openSnackBar('Failed to update successfuly');
        });
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
    }

}

@Component({
    selector: 'add-ticket-dialog',
    templateUrl: 'add-ticket-dialog.html'
  })
  export class AddTicketDialog {

    ticketForm: FormGroup;

    problem: any;
    clientProduct: any;
    clients: any;

    loading: boolean = false;
    clientProductFailed: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: TicketDialogData,
        public dialogRef: MatDialogRef<AddTicketDialog>,
        private _formBuilder: FormBuilder,
        private falconService: FalconService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog
    ){ }

    ngOnInit(): void
    {
        this.getClients();
        this.getProblem();
        this.ticketForm = this._formBuilder.group({
            client_id: [this.data.client_id, [Validators.required]],
            problem_id: [this.data.ticket.problem_id, [Validators.required]],
            client_product_id: [this.data.ticket.client_product_id, [Validators.required]],
            details: [this.data.ticket.details, [Validators.required]]
        });
        if(this.data.client_id){
            this.getClientProduct();
        }
        else{
            this.ticketForm.get('client_product_id').disable();
        }
    }

    getClients(){
        this.loading = true;
        this.falconService.getClient()
        .subscribe((result) => {
            this.clients = result;
            this.loading = false;
            // this.getClientProduct();
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.loading = false;
        });
    }

    getProblem(){
        this.loading = true;
        this.falconService.getProblem()
        .subscribe((result) => {
            this.problem = result;
            this.loading = false;
        },
        (error) => {
            this.loading = false;
            this.openSnackBar('Failed to load Problems');
            // this.getClientProduct();
        });
    }

    getClientProduct(){
        this.loading = true;
        this.falconService.getClientProduct(this.data.client_id)
        .subscribe((result) => {
            this.clientProduct = result;
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load Client\'s Product');
            this.loading = false;
        });
    }

    openClientAddDialog(type, id, client: OrganisationMaster) {
        const dialogRef = this.dialog.open(AddClientDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                client: client
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.clients.length = 0;
                this.getClients();
            }
        });
    }

    openProblemAddDialog() {
        const dialogRef = this.dialog.open(AddProblemDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: 'Add',
                id: 0,
                problem_name: '',
                description: ''
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.problem.length = 0;
                this.getProblem();
            }
        });
    }

    openClientProductAddDialog() {
        const dialogRef = this.dialog.open(AddClientProductDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: 'Add',
                id: 0,
                clientProduct: ''
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.clientProduct.length = 0;
                this.getClientProduct();
            }
        });
    }

    onClientChange(event){
        this.ticketForm.get('client_product_id').enable();
        this.data.client_id = event.value;
        this.ticketForm.get('client_id').setValue(event.value);
        this.getClientProduct();
    }

    addTicket(){
        this.loading = true;

        var data = {
            id: this.data.id,
            org_id: localStorage.getItem('userId'),
            client_id: this.data.client_id,
            problem_id: this.ticketForm.get('problem_id').value,
            client_product_id: this.ticketForm.get('client_product_id').value,
            details: this.ticketForm.get('details').value,
            created_by: localStorage.getItem('userId')
        };
        if(this.data.id == 0){
            this.falconService.addTicket(data)
            .subscribe((result) => {
                this.openSnackBar('Ticket successfuly Generated');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Generated Ticket');
                this.loading = false;
                console.log(error);
            });
        }
        else{
            this.falconService.editTicket(data)
            .subscribe((result) => {
                this.openSnackBar('Ticket successfuly Edited');
                this.loading = false;
                this.dialogRef.close();
            },
            (error) => {
                this.openSnackBar('Failed to Edit Ticket');
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
