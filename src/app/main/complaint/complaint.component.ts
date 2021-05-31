import { result } from 'lodash';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FalconService } from 'app/service/falcon.service';
import { AddTicketDialog } from '../view-client/tabs/client-tickets/client-tickets.component';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ComplaintComponent implements OnInit {

    loading: boolean = true;
    loadingEngineer: boolean = false;
    failedEngineer:boolean = false;
    failed: boolean = false;
    tickets: any = [];
    engineers: any = [];
    search = '';
    orderBy = 'tickets.id';
    order = 'desc';
    offset = 0;
    totalRows: number;
    infiniteScrollLoading: boolean = false;
    isInfiniteScrollDisabled: boolean = false;

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
        // this.getEngineer();
      }

    getAllTickets(){
        var s;
        if(this.search == ''){
            s = 'null';
            this.search = null;
        }
        else{
            s = this.search;
        }
        this.failed = false;
        this.falconService.getAllTicket(s, this.orderBy, this.order, this.offset)
        .subscribe((result: any) => {
            // this.tickets = result.data;
            result.data.forEach(element => {
                this.tickets.push(element);
            });
            // this.tickets = [...this.tickets, ...result.data];
            this.totalRows = result.totalRows;
            this.offset += result.data.length;
            this.isInfiniteScrollDisabled = false;
            if(this.offset >= result.totalRows){
                this.isInfiniteScrollDisabled = true;
            }
            this.loading = false;
            this.infiniteScrollLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load');
            this.loading = false;
            this.failed = true;
            this.infiniteScrollLoading = false;
        });
    }

    resetFilters(){
        this.loading = true;
        this.tickets.length = 0;
        this.search = '';
        this.orderBy = 'tickets.id';
        this.order = 'desc';
        this.offset = null;
        this.totalRows = null;
        this.getAllTickets();
    }

    onSearch(search){
        this.loading = true;
        this.tickets.length = 0;
        this.search = search;
        this.offset = null;
        this.totalRows = null;
        this.getAllTickets();
    }

    onColumnSort(columnName){
        this.loading = true;
        this.tickets.length = 0;
        this.offset = null;
        this.totalRows = null;
        if(this.orderBy == columnName){
            if(this.order == 'asc'){
                this.order = 'desc';
            }
            else{
                this.order = 'asc';
            }
        }
        else{
            this.order = 'asc';
        }
        this.orderBy = columnName;
        this.getAllTickets();
    }

    onScroll(){
        if(this.isInfiniteScrollDisabled == false){
            this.isInfiniteScrollDisabled = true;
            this.infiniteScrollLoading = true;
            this.getAllTickets();
        }
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
                this.resetFilters();
                // this.getAllTickets();
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

    onAssignEngineerSelectClick(areaid, problemid){
        this.engineers.length = 0;
        this.loadingEngineer = true;
        this.failedEngineer = false;    
        this.falconService.assigningRecommendationsEngineer(areaid, problemid)
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

    onAssignEngineerChange(event, index){
        this.loading = true;
        let data = {
            id: index,
            engineer_id: event.value,
            status: 1
        };
        this.falconService.assignEngineer(data)
        .subscribe((result) => {
            this.resetFilters();
            // this.getAllTickets();
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
            this.resetFilters();
            // this.getAllTickets();
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
