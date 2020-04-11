import { Component, OnInit } from '@angular/core';
//import { Routes, RouterModule, Params } from '@angular/router';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
  ) {
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    console.log("edit-user se ha cargado");
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.status = 'error';
        } else {
          this.status = 'succes';
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          // subida de imagen de usuario
          this._uploadService.makeFilesRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
            .then((result: any) => {
              console.log(result);
              // actualizamos el objeto
              this.user.image = result.user.image;
              // actualizamos el localStorage
              localStorage.setItem('identity', JSON.stringify(this.user));
            })
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    )
  }

  ngDoCheck() {
    this.identity = this.user;
  }

  // Array para guardar las imagenes seleccionadas.
  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    // capturar ficheros del fileInput
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }
}
