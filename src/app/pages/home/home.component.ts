import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }


  onStartClicked(): void {
    this.router.navigate(['game']);
  }

  onAboutClicked(): void {
    this.router.navigate(['about']);
  }

  onInstructionClicked(): void {
    this.router.navigate(['instruction']);
  }

  onCreditClicked(): void {
    this.router.navigate(['credit']);
  }
}
