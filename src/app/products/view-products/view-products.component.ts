import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  productId:string=""

  //to hold product detail
  product:any={}

  constructor(private viewActivatedRoute:ActivatedRoute, private api:ApiService){

  }
  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data:any)=>{
      console.log(data.id);
      this.productId = data.id
      
    })
    //api call to get particular detail
    this.api.viewAproduct(this.productId).subscribe(
      //200
      (result:any)=>{
        console.log(result);
        this.product=result
        
      },
      //400
      (result:any)=>{
        console.log(result.error);
        
      }
    )
  }

  addToWishlist(product:any){
    this.api.addtowishlist(product)
    .subscribe((result:any)=>{
      alert(result)
    },
    (result:any)=>{
      alert(result.error)
    }
    )
  }

   //addtocart(product)
   addtocart(product:any){
    //add quaqntity key to product object with value as 1
    Object.assign(product,{quantity:1})
    console.log(product);
    
    //call api
    this.api.addToCart(product)
    .subscribe(
      (result:any)=>{
        //call method to get cart count
        this.api.cartCount()
        alert(result)
      },
      (result:any)=>{
        alert(result.error)
      }
    )

    
  }


}
