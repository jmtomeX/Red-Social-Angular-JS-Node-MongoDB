import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public title: string;
  public status: string;
  public checked: boolean;
  public word: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(searchForm) {
    this._userService.searchUser(this.word).subscribe(
      response => {
       // this.user = response;

        // si llega la propiedad user y esa propieda tiene un _id
        if (response.user && response.user._id) {

          this.status = 'succes';
          searchForm.reset();
        } else {
          this.status = 'error';

        }
      },
      error => {
        console.log(<any>error);
      }
    );


  }
}
