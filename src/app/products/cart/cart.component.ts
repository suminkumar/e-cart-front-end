import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
//paypal import
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  //paypal property
  public payPalConfig ? : IPayPalConfig;

  cartItems:any=[]
  cartTotalPrice:number =0
  offerStatus:boolean = false
  finalAmount:number =0
  offertagStatus:boolean = true
  paymentBtn:boolean = false
  makepaymentStatus:boolean = false
  showSuccess:boolean = false
  showCancel:boolean = false
  showError:boolean = false

  user:any = {}

  addressForm = this.fb.group({
    username:[''],
    addr1:[''],
    addr2:[''],
    addr3:[''],
    addr4:[''],
    state:['']
  })

  constructor(private api:ApiService, private fb:FormBuilder){

  }

  ngOnInit(): void {
    this.getCart()
    //cal paypal
    this.initConfig();
  }

  getCart(){
    this.api.getCart().subscribe(
      (result:any)=>{
        console.log(result);
        this.cartItems = result
        //call cart price
        this.getCartTotalPrice()
        
      },
      (result:any)=>{
        console.log(result.error);
      }
    )
  }

  //getCartTotalPrice
  getCartTotalPrice(){
    let total = 0
    this.cartItems.forEach((item:any)=>{
     total+=item.grantTotal
      this.cartTotalPrice = Math.ceil(total)
      this.finalAmount = this.cartTotalPrice
    })
  }

  //remove cart item
  removeCartItem(id:any){
    this.api.removeCartItem(id).subscribe(
      (result:any)=>{
        this.cartItems = result
        //cal cart price
        this.getCartTotalPrice()
        //to change cart count
        this.api.cartCount()

      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  //incremet cart item
  incrementCartItem(id:any){
    this.api.incrementCartItem(id).subscribe(
      (result:any)=>{
        this.cartItems = result
        //cal cart price
        this.getCartTotalPrice()
        //to change cart count
        this.api.cartCount()

      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  
  //decremet cart item
  decrementCartItem(id:any){
    this.api.decrementCartItem(id).subscribe(
      (result:any)=>{
        this.cartItems = result
        //cal cart price
        this.getCartTotalPrice()
        //to change cart count
        this.api.cartCount()

      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  //empty cart
  emptyCart(){
    this.api.emptyCart().subscribe(
      (result:any)=>{
        this.cartItems = []
            //cal cart price
            this.getCartTotalPrice()
            //to change cart count
            this.api.cartCount()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  //viewoffer
  viewoffers(){
    this.offerStatus = true
  }

  //discount10
  discount10(){
   let discount = this.cartTotalPrice *10/100
    this.finalAmount = this.cartTotalPrice - discount
    this.offerStatus = false
    this.offertagStatus = false
  }

  //discount50
  discount50(){
    let discount1 = this.cartTotalPrice *50/100
    this.finalAmount = this.cartTotalPrice - discount1
    this.offerStatus = false
    this.offertagStatus = false

  }

  //submit
  submit(){
    if(this.addressForm.valid){
      this.paymentBtn = true
      this.user.username = this.addressForm.value.username
      this.user.addr1 = this.addressForm.value.addr1
      this.user.addr2 = this.addressForm.value.addr2
      this.user.addr3 = this.addressForm.value.addr3
      this.user.addr4 = this.addressForm.value.addr4
      this.user.state = this.addressForm.value.state

    }
    else{
      alert('Invalid Form')
    }
  }

  //makepaymentStatus
  makepayment(){
    this.makepaymentStatus = true
  }

  //paypal
  private initConfig(): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: '9.99'
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'EUR',
                        value: '9.99',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.showSuccess = true;
            //alert("Payment succesfully completed... Your order is confirmed!!!")
            //empty cart
            this.emptyCart()
            this.makepaymentStatus=false
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.showCancel = true;
            this.makepaymentStatus=false

        },
        onError: err => {
            console.log('OnError', err);
            this.showError = true;
            this.makepaymentStatus=false
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
           // this.resetStatus();
        }
    };
}

//modalClose
modalClose(){
  this.addressForm.reset()
  this.paymentBtn = false
  this.makepaymentStatus = false
  this.showCancel = false
  this.showError = false
  this.showSuccess = false
}
}
