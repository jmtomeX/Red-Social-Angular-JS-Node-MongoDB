import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { UploadService } from '../../services/upload.service';
declare var $: any;



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {
  public title: string;
  public token;
  public url: string;
  public identity;
  public stats;
  public status;
  public publication: Publication;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _publicationService: PublicationService,
    private _uploadService: UploadService
  ) {
    this.title = 'Panel de usuario';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    // valores del usuario identificado
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication("", "", "", "", this.identity._id);
  }
  ngOnInit(): void {
    console.log("Componente sidebar cargado");

    // devolver nombre de archivo
    $("input:text").click(function () {
      $(this).parent().find("input:file").click();
    });

    $('input:file', '.ui.action.input')
      .on('change', function (e) {
        var name = e.target.files[0].name;
        $('input:text', $(e.target).parent()).val(name);
      });
  }

  onSubmit(newPubForm) {
    console.log(this.publication);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {

          // subimos el archivo
          this._uploadService.makeFilesRequest(
            this.url + 'upload-image-pub/' + response.publication._id,
            [],
            this.filesToUpload,
            this.token,
            'image'
          ).then((result: any) => {
            this.publication.file = result.image; //es lo que devuelve la api el result
            this.status = 'succes';
            newPubForm.reset();
            // reenvio para actulizar las publicaciones.
            this._router.navigate(['/timeline']);
          })
        } else {
          this.status = 'error';
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


  public filesToUpload: Array<File>;
  //recoger ficheros por el input que le pasamos como parámetro en el html
  // una vez que se cargue el archivo se hace la subida al servidor en el onSubmit
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }



  @Output() sended = new EventEmitter()
  sendPublication(event) {
    console.log(event);
    // emite el evento
    this.sended.emit({
      send: true
    })
  }

}
