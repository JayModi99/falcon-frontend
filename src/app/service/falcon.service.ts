import { EncryptDecryptService } from 'app/service/EncryptDecrypt.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FalconService {
    
    private url: string = "http://localhost:8000/api/";
    // private url: string = 'https://falcon-api.fi.tempcloudsite.com/api/';

    userId = localStorage.getItem('userId');

    constructor(
        private http: HttpClient,
        private encryptDecryptService: EncryptDecryptService
    ) { }

    private subjectName = new Subject<any>();

    sendUpdate(message: string) { //the component that wants to update something, calls this fn
        this.subjectName.next({ text: message }); //next() will feed the value in Subject
    }

    getUpdate(): Observable<any> { //the receiver component calls this function 
        return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }

    save(data){
        return this.http.post(this.url + "organisationMaster/save", data);
    }

    login(data){
        return this.http.post(this.url + "organisationMaster/login", data);
    }

    getIndustryType(){
        return this.http.get(this.url + 'industryType/getAll');
    }

    getProductCategory(){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'productCategory/getAll/' + userId);
    }

    getAllProductCategoryByFilters(search, orderBy, order, offset){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'productCategory/getAllByFilters/' + userId + '/' + search + '/' + orderBy + '/' + order + '/' + offset);
    }

    addProductCategory(data){
        return this.http.post(this.url + 'productCategory/save', data);
    }

    editProductCategory(data){
        return this.http.post(this.url + 'productCategory/update', data);
    }

    deleteProductCategory(id){
        return this.http.delete(this.url + 'productCategory/deleteById/' + id);
    }

    getProduct(){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'product/getAll/' + userId);
    }

    getProductByCategoryId(id){
        return this.http.get(this.url + 'product/getProductByCategoryId/' + id);
    }

    addProduct(data){
        return this.http.post(this.url + 'product/save', data);
    }

    editProduct(data){
        return this.http.post(this.url + 'product/update', data);
    }

    deleteProduct(id){
        return this.http.delete(this.url + 'product/deleteById/' + id);
    }

    getClient(){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'client/getAll/' + userId);
    }

    getClientById(id){
        return this.http.get(this.url + 'client/getById/' + id);
    }

    addClient(data){
        return this.http.post(this.url + 'client/save', data);
    }

    editClient(data){
        return this.http.post(this.url + 'client/update', data);
    }

    deleteClient(id){
        return this.http.delete(this.url + 'client/deleteById/' + id);
    }

    getArea(){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'area/getAll/' + userId);
    }

    addArea(data){
        return this.http.post(this.url + 'area/save', data);
    }

    editArea(data){
        return this.http.post(this.url + 'area/update', data);
    }

    deleteArea(id){
        return this.http.delete(this.url + 'area/deleteById/' + id);
    }

    getEngineer(){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'engineer/getAll/' + userId);
    }

    addEngineer(data){
        return this.http.post(this.url + 'engineer/save', data);
    }

    editEngineer(data){
        return this.http.post(this.url + 'engineer/update', data);
    }

    deleteEngineer(id){
        return this.http.delete(this.url + 'engineer/deleteById/' + id);
    }

    getAreaOfEngineer(id){
        return this.http.get(this.url + 'engineer/getAreaOfEngineer/' + id);
    }

    getProblemOfEngineer(id){
        return this.http.get(this.url + 'engineer/getProblemOfEngineer/' + id);
    }

    getProblem(){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'problem/getAll/' + userId);
    }

    addProblem(data){
        return this.http.post(this.url + 'problem/save', data);
    }

    editProblem(data){
        return this.http.post(this.url + 'problem/update', data);
    }

    deleteProblem(id){
        return this.http.delete(this.url + 'problem/deleteById/' + id);
    }

    getClientProduct(cid){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'clientProduct/getAll/' + userId + '/' + cid);
    }

    addClientProduct(data){
        return this.http.post(this.url + 'clientProduct/save', data);
    }

    editClientProduct(data){
        return this.http.post(this.url + 'clientProduct/update', data);
    }

    deleteClientProduct(id){
        return this.http.delete(this.url + 'clientProduct/deleteById/' + id);
    }

    getUnassignedTicket(search, orderBy, order, offset){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'ticket/getUnassignedTicket/' + userId + '/' + search + '/' + orderBy + '/' + order + '/' + offset);
    }

    getAssignedTicket(search, orderBy, order, offset){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'ticket/getAssignedTicket/' + userId + '/' + search + '/' + orderBy + '/' + order + '/' + offset);
    }

    getCompletedTicket(search, orderBy, order, offset){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'ticket/getCompletedTicket/' + userId + '/' + search + '/' + orderBy + '/' + order + '/' + offset);
    }

    getAllTicket(search, orderBy, order, offset){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'ticket/getAll/' + userId + '/' + search + '/' + orderBy + '/' + order + '/' + offset);
    }

    getTicket(cid){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'ticket/getByClient/' + userId + '/' + cid);
    }

    getTicketById(id){
        return this.http.get(this.url + 'ticket/getById/' + id);
    }

    addTicket(data){
        return this.http.post(this.url + 'ticket/save', data);
    }

    editTicket(data){
        return this.http.post(this.url + 'ticket/update', data);
    }

    deleteTicket(id){
        return this.http.delete(this.url + 'ticket/deleteById/' + id);
    }

    assignEngineer(data){
        return this.http.post(this.url + 'ticket/assignEngineer', data);
    }

    changeStatus(data){
        return this.http.post(this.url + 'ticket/changeStatus', data);
    }

    assigningRecommendationsEngineer(areaid, problemid){
        var userId = localStorage.getItem('userId');
        return this.http.get(this.url + 'ticket/assigningRecommendationsEngineer/' + userId + '/' + areaid + '/' + problemid);
    }

}
