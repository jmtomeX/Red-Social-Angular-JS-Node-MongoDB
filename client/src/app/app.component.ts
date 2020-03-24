import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title1 = 'Sport';
  title2 = 'Metting';

  ngOnInit() {

    // if (typeof $ != 'undefined') {
    //   // jQuery is loaded => print the version
    //   alert($.fn.jquery);
    // } else {
    //   // jQuery was not loaded
    //   console.error("No jquery");
    // }
  }
}
