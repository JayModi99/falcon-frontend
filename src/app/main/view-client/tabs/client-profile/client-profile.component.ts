import { OrganisationMaster } from 'app/model/OrganisationMaster';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {

    @Input()
    client: OrganisationMaster;

    constructor() { }

    ngOnInit() {
    }

}