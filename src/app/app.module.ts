import { ViewClientModule } from './main/view-client/view-client.module';
import { EngineerModule } from './main/engineer/engineer.module';
import { ComplaintModule } from './main/complaint/complaint.module';
import { ClientModule } from './main/client/client.module';
import { ProductModule } from './main/product/product.module';
import { AppRoutingModule } from './app-routing.module';
import { ProductCategoryModule } from './main/product-category/product-category.module';
import { AuthGuardService } from './service/auth-guard.service';
import { LoginModule } from './main/login/login.module';
import { RegisterModule } from './main/register/register.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AreasModule } from './main/areas/areas.module';
import { ProblemModule } from './main/problem/problem.module';

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'sample'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        AppRoutingModule,
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,

        // App modules
        LayoutModule,
        SampleModule,
        RegisterModule,
        LoginModule,
        ProductCategoryModule,
        ProductModule,
        AreasModule,
        ClientModule,
        ComplaintModule,
        EngineerModule,
        ProblemModule,
        ViewClientModule
    ],
    providers   : [
        AuthGuardService,
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
