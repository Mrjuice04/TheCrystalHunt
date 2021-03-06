import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instruction-page',
  templateUrl: './instruction-page.component.html',
  styleUrls: ['./instruction-page.component.css']
})
export class InstructionPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBackClicked(): void {
    this.router.navigate(['']);
  }
}
