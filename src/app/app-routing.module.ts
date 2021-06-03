import { ComplaintDetailsComponent } from './main/complaint-details/complaint-details.component';
import { ComplaintDetailsModule } from './main/complaint-details/complaint-details.module';
import { ViewClientComponent } from './main/view-client/view-client.component';
import { EngineerComponent } from './main/engineer/engineer.component';
import { ComplaintComponent } from './main/complaint/complaint.component';
import { ClientComponent } from './main/client/client.component';
import { SampleComponent } from './main/sample/sample.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { ProductCategoryComponent } from './main/product-category/product-category.component';
import { LoginComponent } from './main/login/login.component';
import { RegisterComponent } from './main/register/register.component';
import { ProductComponent } from './main/product/product.component';
import { AreasComponent } from './main/areas/areas.component';
import { ProblemComponent } from './main/problem/problem.component';

const routes: Routes = [
  {path: '', redirectTo: '/product-category', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'sample', component: SampleComponent, canActivate: [AuthGuard]},
  {path: 'product-category', component: ProductCategoryComponent, canActivate: [AuthGuard]},
  {path: 'product', component: ProductComponent, canActivate: [AuthGuard]},
  {path: 'area', component: AreasComponent, canActivate: [AuthGuard]},
  {path: 'client', component: ClientComponent, canActivate: [AuthGuard]},
  {path: 'complaint', component: ComplaintComponent, canActivate: [AuthGuard]},
  {path: 'engineer', component: EngineerComponent, canActivate: [AuthGuard]},
  {path: 'problem', component: ProblemComponent, canActivate: [AuthGuard]},
  {path: 'client/:id', component: ViewClientComponent, canActivate: [AuthGuard]},
  {path: 'complaint/:id', component: ComplaintDetailsComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/product-category'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
