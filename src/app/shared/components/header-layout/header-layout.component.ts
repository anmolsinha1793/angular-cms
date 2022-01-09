import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss']
})
export class HeaderLayoutComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }
  showLogout(): boolean {
    return !!sessionStorage.getItem('role');
  }
  logout(): void {
    sessionStorage.clear();
    this.route.navigate(['./login']);
  }
}
