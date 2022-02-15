import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asapScheduler, Observable } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { 
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
       email: ['', Validators.required ],
       password: ['', Validators.required ]
    });
  }

  ngOnInit(): void { }

   showPassword() {
    const x = <HTMLInputElement> document.getElementById("password");
    if (x.type == "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  successMessage:boolean = true;
  emailOk:boolean = false;

  showMessage() {
    if (this.successMessage) {
    const b:any = document.querySelector('span');
      b.style.color = "Green";
      b.innerHTML = "- You have been successfully registered.";
    }
    else {
      const b:any = document.querySelector('span');
      b.style.color = "Red";
      b.innerHTML = "- ERROR in registration process.";
    }
  }

  eraseAlreadyMessage() {
          const c:any = document.querySelector('h4');
          c.innerHTML = "";
  }

  eraseValidationMessage() {
    const b:any = document.querySelector('span');
    b.innerHTML = "";
  }

  showErrorMessage() {
      this.successMessage = false;
      this.showMessage();
      this.eraseAlreadyMessage();
  }

  checkingEmail() {
    this.http.get("http://localhost:3000/people").subscribe((result=>{
      const allUsers:any = result;
      console.log(this.registerForm.value);
      for(let i=0; i<allUsers.length; i++)
      {
        console.log(allUsers[i].email);
        if (this.registerForm.value.email != allUsers[i].email)
        {
          this.emailOk = true;
        }
        else
        {
          this.emailOk = false;
          this.eraseValidationMessage();
          const c:any = document.querySelector('h4');
          c.style.color = "Red";
          c.innerHTML = "This email is already used!";
        } 
      }
    }),
    (error) => {
      console.log(error);
      this.showErrorMessage();
    })
  }

  addUser() {
    this.http.post('http://localhost:3000/people', this.registerForm.value)
    .subscribe((result=>{
      console.log(this.registerForm.value.email);
      console.warn("result", result);
      this.successMessage = true;
      this.showMessage();
      this.eraseAlreadyMessage();
      this.registerForm.reset();
      this.emailOk = false;
    }),
    (error) => {
      console.log(error);
      this.showErrorMessage();
    }
    )
    this.emailOk = false;
  }

  onClickSubmit(data:any) {
    this.eraseValidationMessage();
    console.log(this.registerForm.value.email);
    this.checkingEmail();
    if (this.emailOk){
    this.addUser();
    }
  }
}
