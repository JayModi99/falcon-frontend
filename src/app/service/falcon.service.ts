import { EncryptDecryptService } from 'app/service/EncryptDecrypt.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FalconService {
    
    //private url: string = "http://localhost:8000/api/";
    private url: string = 'https://falcon-api.fi.tempcloudsite.com/api/';

    userId = localStorage.getItem('userId');

    constructor(
        private http: HttpClient,
        private encryptDecryptService: EncryptDecryptService
    ) { }

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

    addProductCategory(data){
        return this.http.post(this.url + 'productCategory/save', data);
    }

    editProductCategory(data){
        return this.http.post(this.url + 'productCategory/update', data);
    }

    deleteProductCategory(id){
        return this.http.delete(this.url + 'productCategory/deleteById/' + id);
    }

}
