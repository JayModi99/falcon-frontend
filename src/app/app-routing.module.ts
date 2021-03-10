import { SampleComponent } from './main/sample/sample.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { ProductCategoryComponent } from './main/product-category/product-category.component';
import { LoginComponent } from './main/login/login.component';
import { RegisterComponent } from './main/register/register.component';
import { ProductComponent } from './main/product/product.component';

const routes: Routes = [
  {path: '', redirectTo: '/product-category', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'sample', component: SampleComponent, canActivate: [AuthGuard]},
  {path: 'product-category', component: ProductCategoryComponent, canActivate: [AuthGuard]},
  {path: 'product', component: ProductComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/product-category'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
