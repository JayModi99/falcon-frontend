import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FalconService } from 'app/service/falcon.service';
import { AddTicketDialog } from '../view-client/tabs/client-tickets/client-tickets.component';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ComplaintDetailsComponent implements OnInit {

    complaintId: number;
    loading: boolean = false;

    ticket: any;
    ticketLoading: boolean = false;
    ticketFailed: boolean = false;

    engineers: any;
    loadingEngineer: boolean = true;
    failedEngineer: boolean = false;

    constructor(
        private titleService: Title,
        private route:ActivatedRoute,
        private falconService: FalconService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.titleService.setTitle("Falcon - Complaint");
    }

    ngOnInit() {
        this.complaintId = +this.route.snapshot.paramMap.get('id');
        this.getTicket();
    }

    getTicket(){
        this.ticketLoading = true;
        this.loadingEngineer = true;
        this.ticketFailed = false;
        this.falconService.getTicketById(this.complaintId)
        .subscribe((result: any) => {
            this.ticket = result[0];
            this.ticketLoading = false;
            if(!this.ticket.engineer_id){
                this.loadEngineers();
            }
            else{
                this.loadingEngineer = false;
            }
        },
        (error) => {
            this.ticketFailed = true;
            this.ticketLoading = false;
            this.openSnackBar('Failed to load Ticket');
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
                this.ticket = null;
                this.getTicket();
            }
        });
    }

    deleteTicket(id){
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
                    this.router.navigateByUrl('/complaint');
                    this.loading = false;
                },
                (error) => {
                    this.openSnackBar('Failed to Delete');
                    this.loading = false;
                });
            }
        });
    }

    loadEngineers(){
        var areaId = this.ticket.area_id; 
        var problemId = this.ticket.problem_id
        this.engineers = null;
        this.loadingEngineer = true;
        this.failedEngineer = false;    
        this.falconService.assigningRecommendationsEngineer(areaId, problemId)
        .subscribe((result) => {
            this.loadingEngineer = false;
            this.engineers = result;
        },
        (error) => {
            this.failedEngineer = true;
            this.loadingEngineer = false;
            this.openSnackBar('Failed to load');
        });
    }

    onAssignEngineerChange(event){
        this.loading = true;
        let data = {
            id: this.complaintId,
            engineer_id: event.value,
            status: 1
        };
        this.falconService.assignEngineer(data)
        .subscribe((result) => {
            this.ticket = null;
            this.loading = false;
            this.getTicket();
            this.openSnackBar('Engineer assigned successfuly');
        },
        (error) => {
            this.loading = false;
            this.openSnackBar('Failed to assign engineer');
        });
    }

    ticketComplete(){
        this.loading = true;
        let data = {
            'id': this.complaintId,
            'status': 3
        };
        this.falconService.changeStatus(data)
        .subscribe((result) => {
            this.ticket = null;
            this.loading = false;
            this.getTicket();
            this.openSnackBar('Status updated successfuly');
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
