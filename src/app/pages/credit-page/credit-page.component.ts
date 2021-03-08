import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Credit-page',
  templateUrl: './Credit-page.component.html',
  styleUrls: ['./Credit-page.component.css']
})
export class CreditPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBackClicked(): void {
    this.router.navigate(['']);
  }
}
