import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FalconService } from 'app/service/falcon.service';
import { AddTicketDialog } from '../view-client/tabs/client-tickets/client-tickets.component';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ComplaintComponent implements OnInit {

    loading: boolean = false;
    failed: boolean = false;
    tickets: any;
    engineers: any;

    constructor(
        private titleService: Title,
        private falconService: FalconService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
            this.titleService.setTitle("Falcon - Complaint");
     }

    ngOnInit() {
        this.getAllTickets();
        this.getEngineer();
      }

    getAllTickets(){
        this.loading = true;
        this.failed = false;
        this.falconService.getAllTicket()
        .subscribe((result) => {
            this.tickets = result;
            this.loading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.loading = false;
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

    openTicketAddDialog(type, id, clientProduct, clientId) {
        const dialogRef = this.dialog.open(AddTicketDialog, {
            disableClose: true, 
            autoFocus: false,
            data: {
                type: type,
                id: id,
                ticket: clientProduct,
                client_id: clientId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result != 0){
                this.tickets.length = 0;
                this.getAllTickets();
            }
        });
    }

    onAssignEngineerChange(event, index){
        this.tickets[index].status = 1;
        this.tickets[index].engineer_name = event.value;
    }

    ticketComplete(index){
        this.tickets[index].status = 3;
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
    }

}

