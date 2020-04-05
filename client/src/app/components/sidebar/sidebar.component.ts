import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { Publication } from '../../models/publication';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})
export class SidebarComponent implements OnInit {
  public title: string;
  public token;
  public url: string;
  public identity;
  public stats;
  public publication: Publication;

  constructor(
    private _userService: UserService,

  ) {
    this.title = 'Panel de usuario';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    // valores del usuario identificado
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication("","","","",this.identity._id);
  }
  ngOnInit(): void {
    console.log("Componente sidebar cargado");

    $("input:text").click(function() {
      $(this).parent().find("input:file").click();
    });

    $('input:file', '.ui.action.input')
      .on('change', function(e) {
        var name = e.target.files[0].name;
        $('input:text', $(e.target).parent()).val(name);
      });
  }

  onSubmit(){
    console.log(this.publication);
  }

}
