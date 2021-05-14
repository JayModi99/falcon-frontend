import { OrganisationMaster } from 'app/model/OrganisationMaster';
import { FalconService } from 'app/service/falcon.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddClientDialog } from '../client/client.component';
import { AddClientProductDialog, ClientProduct } from './tabs/client-products/client-products.component';
import { Title } from '@angular/platform-browser';
import { AddTicketDialog } from './tabs/client-tickets/client-tickets.component';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ViewClientComponent implements OnInit {

    loading: boolean = false;

    clientId: number;
    client: OrganisationMaster;

    constructor(
        private titleService: Title,
        private route:ActivatedRoute,
        private falconService: FalconService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.clientId = +this.route.snapshot.paramMap.get('id');
        this.getClientById();
    }

    getClientById(){
        this.loading = true;
        this.falconService.getClientById(this.clientId)
        .subscribe((result: OrganisationMaster) => {
            this.client = result[0];
            this.loading = false;
            this.titleService.setTitle("Falcon - " + this.client.organisation_name);
        },
        (error) => {
            console.log(error);
            this.loading = false;
        });
    }

    openClientProductAddDialog(type, id, clientProduct: ClientProduct, clientId) {
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
                this.sendMessage('Reload Client Products');
            }
        });
    }

    openTicketAddDialog(type, id, ticket: any, clientId) {
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
                this.sendMessage('Reload Ticket');
            }
        });
    }

    sendMessage(msg): void {
        // send message to subscribers via observable subject
        this.falconService.sendUpdate(msg);
    }

    openClientAddDialog() {
        const dialogRef = this.dialog.open(AddClientDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: 'Edit',
                id: this.clientId,
                client: this.client
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.client = null;
                this.getClientById();
            }
        });
    }

}
