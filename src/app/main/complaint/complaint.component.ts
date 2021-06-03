import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FalconService } from 'app/service/falcon.service';
import { AddTicketDialog } from '../view-client/tabs/client-tickets/client-tickets.component';
import { DeleteDialog } from '../dialog/delete-dialog/delete-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ComplaintComponent implements OnInit {

    currentTab = 'Unassigned';

    unassignedTicketsLoading: boolean = true;
    unassignedTicketsFailed: boolean = false;
    unassignedTickets: any = [];
    unassignedTicketsSearch = '';
    unassignedTicketsOrderBy = 'tickets.id';
    unassignedTicketsOrder = 'desc';
    unassignedTicketsOffset = 0;
    unassignedTicketsTotalRows: number;
    unassignedTicketsInfiniteScrollLoading: boolean = false;
    unassignedTicketsIsInfiniteScrollDisabled: boolean = false;

    assignedTicketsLoading: boolean = true;
    assignedTicketsFailed: boolean = false;
    assignedTickets: any = [];
    assignedTicketsSearch = '';
    assignedTicketsOrderBy = 'tickets.id';
    assignedTicketsOrder = 'desc';
    assignedTicketsOffset = 0;
    assignedTicketsTotalRows: number;
    assignedTicketsInfiniteScrollLoading: boolean = false;
    assignedTicketsIsInfiniteScrollDisabled: boolean = false;

    completedTicketsLoading: boolean = true;
    completedTicketsFailed: boolean = false;
    completedTickets: any = [];
    completedTicketsSearch = '';
    completedTicketsOrderBy = 'tickets.id';
    completedTicketsOrder = 'desc';
    completedTicketsOffset = 0;
    completedTicketsTotalRows: number;
    completedTicketsInfiniteScrollLoading: boolean = false;
    completedTicketsIsInfiniteScrollDisabled: boolean = false;

    allTicketsLoading: boolean = true;
    allTicketsFailed: boolean = false;
    allTickets: any = [];
    allTicketsSearch = '';
    allTicketsOrderBy = 'tickets.id';
    allTicketsOrder = 'desc';
    allTicketsOffset = 0;
    allTicketsTotalRows: number;
    allTicketsInfiniteScrollLoading: boolean = false;
    allTicketsIsInfiniteScrollDisabled: boolean = false;

    constructor(
        private titleService: Title,
        private falconService: FalconService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
            this.titleService.setTitle("Falcon - Complaint");
     }

    ngOnInit() {
        // forkJoin({
        //     requestOne: this.falconService.getArea(),
        //     requestTwo: this.falconService.getProblem(),
        // })
        // .subscribe(({requestOne, requestTwo}) => {
        //     console.log(requestOne);
        //     console.log(requestTwo);
        // },
        // ({requestOne, requestTwo}) => {
        //     console.log(requestOne);
        //     console.log(requestTwo);
        // });
        this.getUnassignedTickets();
        this.getAssignedTickets();
        this.getCompletedTickets();
        this.getAllTickets();
    }

    //Common methods
    onTabChange(event){
        this.currentTab = event;
    }

    openTicketDetail(id){
        this.router.navigateByUrl('complaint/' + id);
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
                this.allTickets.length = 0;
                this.allTicketResetFilters();
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
                this.allTicketsLoading = true;
                this.falconService.deleteTicket(id)
                .subscribe((result: any) => {
                    this.openSnackBar('Ticket Deleted');
                    this.allTickets.splice(index, 1);
                    this.allTicketsLoading = false;
                },
                (error) => {
                    this.openSnackBar('Failed to Delete');
                    this.allTicketsLoading = false;
                });
            }
        });
    }

    ticketComplete(index){
        this.allTicketsLoading = true;
        let data = {
            'id': index,
            'status': 3
        };
        this.falconService.changeStatus(data)
        .subscribe((result) => {
            this.allTicketResetFilters();
            // this.getAllTickets();
            this.openSnackBar('Status updated successfuly');
            this.allTicketsLoading = false;
        },
        (error) => {
            this.allTicketsLoading = false;
            this.openSnackBar('Failed to update successfuly');
        });
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
    }

    //All tickets methods
    getUnassignedTickets(){
        var s;
        if(this.unassignedTicketsSearch == ''){
            s = 'null';
            this.unassignedTicketsSearch = null;
        }
        else{
            s = this.unassignedTicketsSearch;
        }
        this.unassignedTicketsFailed = false;
        this.falconService.getUnassignedTicket(s, this.unassignedTicketsOrderBy, this.unassignedTicketsOrder, this.unassignedTicketsOffset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.unassignedTickets.push(element);
            });
            this.unassignedTicketsTotalRows = result.totalRows;
            this.unassignedTicketsOffset += result.data.length;
            this.unassignedTicketsIsInfiniteScrollDisabled = false;
            if(this.unassignedTicketsOffset >= result.totalRows){
                this.unassignedTicketsIsInfiniteScrollDisabled = true;
            }
            this.unassignedTicketsLoading = false;
            this.unassignedTicketsInfiniteScrollLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load All Tickets');
            this.unassignedTicketsLoading = false;
            this.unassignedTicketsFailed = true;
            this.unassignedTicketsInfiniteScrollLoading = false;
        });
    }

    unassignedTicketResetFilters(){
        this.unassignedTicketsLoading = true;
        this.unassignedTickets.length = 0;
        this.unassignedTicketsSearch = '';
        this.unassignedTicketsOrderBy = 'tickets.id';
        this.unassignedTicketsOrder = 'desc';
        this.unassignedTicketsOffset = null;
        this.unassignedTicketsTotalRows = null;
        this.getUnassignedTickets();
    }

    unassignedTicketOnSearch(search){
        this.unassignedTicketsLoading = true;
        this.unassignedTickets.length = 0;
        this.unassignedTicketsSearch = search;
        this.unassignedTicketsOffset = null;
        this.unassignedTicketsTotalRows = null;
        this.getUnassignedTickets();
    }

    unassignedTicketOnColumnSort(columnName){
        this.unassignedTicketsLoading = true;
        this.unassignedTickets.length = 0;
        this.unassignedTicketsOffset = null;
        this.unassignedTicketsTotalRows = null;
        if(this.unassignedTicketsOrderBy == columnName){
            if(this.unassignedTicketsOrder == 'asc'){
                this.unassignedTicketsOrder = 'desc';
            }
            else{
                this.unassignedTicketsOrder = 'asc';
            }
        }
        else{
            this.unassignedTicketsOrder = 'asc';
        }
        this.unassignedTicketsOrderBy = columnName;
        this.getUnassignedTickets();
    }

    unassignedTicketOnScroll(){
        if(this.unassignedTicketsIsInfiniteScrollDisabled == false){
            this.unassignedTicketsIsInfiniteScrollDisabled = true;
            this.unassignedTicketsInfiniteScrollLoading = true;
            this.getUnassignedTickets();
        }
    }

    //Assigned tickets methods
    getAssignedTickets(){
        var s;
        if(this.assignedTicketsSearch == ''){
            s = 'null';
            this.assignedTicketsSearch = null;
        }
        else{
            s = this.assignedTicketsSearch;
        }
        this.assignedTicketsFailed = false;
        this.falconService.getAssignedTicket(s, this.assignedTicketsOrderBy, this.assignedTicketsOrder, this.assignedTicketsOffset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.assignedTickets.push(element);
            });
            this.assignedTicketsTotalRows = result.totalRows;
            this.assignedTicketsOffset += result.data.length;
            this.assignedTicketsIsInfiniteScrollDisabled = false;
            if(this.assignedTicketsOffset >= result.totalRows){
                this.assignedTicketsIsInfiniteScrollDisabled = true;
            }
            this.assignedTicketsLoading = false;
            this.assignedTicketsInfiniteScrollLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load All Tickets');
            this.assignedTicketsLoading = false;
            this.assignedTicketsFailed = true;
            this.assignedTicketsInfiniteScrollLoading = false;
        });
    }

    assignedTicketResetFilters(){
        this.assignedTicketsLoading = true;
        this.assignedTickets.length = 0;
        this.assignedTicketsSearch = '';
        this.assignedTicketsOrderBy = 'tickets.id';
        this.assignedTicketsOrder = 'desc';
        this.assignedTicketsOffset = null;
        this.assignedTicketsTotalRows = null;
        this.getAssignedTickets();
    }

    assignedTicketOnSearch(search){
        this.assignedTicketsLoading = true;
        this.assignedTickets.length = 0;
        this.assignedTicketsSearch = search;
        this.assignedTicketsOffset = null;
        this.assignedTicketsTotalRows = null;
        this.getAssignedTickets();
    }

    assignedTicketOnColumnSort(columnName){
        this.assignedTicketsLoading = true;
        this.assignedTickets.length = 0;
        this.assignedTicketsOffset = null;
        this.assignedTicketsTotalRows = null;
        if(this.assignedTicketsOrderBy == columnName){
            if(this.assignedTicketsOrder == 'asc'){
                this.assignedTicketsOrder = 'desc';
            }
            else{
                this.assignedTicketsOrder = 'asc';
            }
        }
        else{
            this.assignedTicketsOrder = 'asc';
        }
        this.assignedTicketsOrderBy = columnName;
        this.getAssignedTickets();
    }

    assignedTicketOnScroll(){
        if(this.assignedTicketsIsInfiniteScrollDisabled == false){
            this.assignedTicketsIsInfiniteScrollDisabled = true;
            this.assignedTicketsInfiniteScrollLoading = true;
            this.getAssignedTickets();
        }
    }

    //Completed tickets methods
    getCompletedTickets(){
        var s;
        if(this.completedTicketsSearch == ''){
            s = 'null';
            this.completedTicketsSearch = null;
        }
        else{
            s = this.completedTicketsSearch;
        }
        this.completedTicketsFailed = false;
        this.falconService.getCompletedTicket(s, this.completedTicketsOrderBy, this.completedTicketsOrder, this.completedTicketsOffset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.completedTickets.push(element);
            });
            this.completedTicketsTotalRows = result.totalRows;
            this.completedTicketsOffset += result.data.length;
            this.completedTicketsIsInfiniteScrollDisabled = false;
            if(this.completedTicketsOffset >= result.totalRows){
                this.completedTicketsIsInfiniteScrollDisabled = true;
            }
            this.completedTicketsLoading = false;
            this.completedTicketsInfiniteScrollLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load All Tickets');
            this.completedTicketsLoading = false;
            this.completedTicketsFailed = true;
            this.completedTicketsInfiniteScrollLoading = false;
        });
    }

    completedTicketResetFilters(){
        this.completedTicketsLoading = true;
        this.completedTickets.length = 0;
        this.completedTicketsSearch = '';
        this.completedTicketsOrderBy = 'tickets.id';
        this.completedTicketsOrder = 'desc';
        this.completedTicketsOffset = null;
        this.completedTicketsTotalRows = null;
        this.getCompletedTickets();
    }

    completedTicketOnSearch(search){
        this.completedTicketsLoading = true;
        this.completedTickets.length = 0;
        this.completedTicketsSearch = search;
        this.completedTicketsOffset = null;
        this.completedTicketsTotalRows = null;
        this.getCompletedTickets();
    }

    completedTicketOnColumnSort(columnName){
        this.completedTicketsLoading = true;
        this.completedTickets.length = 0;
        this.completedTicketsOffset = null;
        this.completedTicketsTotalRows = null;
        if(this.completedTicketsOrderBy == columnName){
            if(this.completedTicketsOrder == 'asc'){
                this.completedTicketsOrder = 'desc';
            }
            else{
                this.completedTicketsOrder = 'asc';
            }
        }
        else{
            this.completedTicketsOrder = 'asc';
        }
        this.completedTicketsOrderBy = columnName;
        this.getCompletedTickets();
    }

    completedTicketOnScroll(){
        if(this.completedTicketsIsInfiniteScrollDisabled == false){
            this.completedTicketsIsInfiniteScrollDisabled = true;
            this.completedTicketsInfiniteScrollLoading = true;
            this.getCompletedTickets();
        }
    }

    //All tickets methods
    getAllTickets(){
        var s;
        if(this.allTicketsSearch == ''){
            s = 'null';
            this.allTicketsSearch = null;
        }
        else{
            s = this.allTicketsSearch;
        }
        this.allTicketsFailed = false;
        this.falconService.getAllTicket(s, this.allTicketsOrderBy, this.allTicketsOrder, this.allTicketsOffset)
        .subscribe((result: any) => {
            result.data.forEach(element => {
                this.allTickets.push(element);
            });
            this.allTicketsTotalRows = result.totalRows;
            this.allTicketsOffset += result.data.length;
            this.allTicketsIsInfiniteScrollDisabled = false;
            if(this.allTicketsOffset >= result.totalRows){
                this.allTicketsIsInfiniteScrollDisabled = true;
            }
            this.allTicketsLoading = false;
            this.allTicketsInfiniteScrollLoading = false;
        },
        (error) => {
            this.openSnackBar('Failed to load All Tickets');
            this.allTicketsLoading = false;
            this.allTicketsFailed = true;
            this.allTicketsInfiniteScrollLoading = false;
        });
    }

    allTicketResetFilters(){
        this.allTicketsLoading = true;
        this.allTickets.length = 0;
        this.allTicketsSearch = '';
        this.allTicketsOrderBy = 'tickets.id';
        this.allTicketsOrder = 'desc';
        this.allTicketsOffset = null;
        this.allTicketsTotalRows = null;
        this.getAllTickets();
    }

    allTicketOnSearch(search){
        this.allTicketsLoading = true;
        this.allTickets.length = 0;
        this.allTicketsSearch = search;
        this.allTicketsOffset = null;
        this.allTicketsTotalRows = null;
        this.getAllTickets();
    }

    allTicketOnColumnSort(columnName){
        this.allTicketsLoading = true;
        this.allTickets.length = 0;
        this.allTicketsOffset = null;
        this.allTicketsTotalRows = null;
        if(this.allTicketsOrderBy == columnName){
            if(this.allTicketsOrder == 'asc'){
                this.allTicketsOrder = 'desc';
            }
            else{
                this.allTicketsOrder = 'asc';
            }
        }
        else{
            this.allTicketsOrder = 'asc';
        }
        this.allTicketsOrderBy = columnName;
        this.getAllTickets();
    }

    allTicketOnScroll(){
        if(this.allTicketsIsInfiniteScrollDisabled == false){
            this.allTicketsIsInfiniteScrollDisabled = true;
            this.allTicketsInfiniteScrollLoading = true;
            this.getAllTickets();
        }
    }

}
