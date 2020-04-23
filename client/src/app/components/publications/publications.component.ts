import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
declare var $: any;

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit, DoCheck {
  public title: string;
  public token;
  public url: string;
  public identity;
  public status: string;
  public page;
  public pages;
  public stats;
  public total;
  public items_per_page;
  public noMore: boolean;
  public publications: Publication[];
  public value_id;
  public loading: boolean;
  @Input() user: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _publicationService: PublicationService
  ) {
    this.title = "Publicaciones"
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.noMore = false;
    this.stats = this._userService.getStats();
    this.loading = true;

  }

  ngOnInit(): void {
    console.log("publications.component se ha cargado correctamente");
    this.getPublicationsOfUser(this.user, this.page);
    $(function () {
      $(document).tooltip();

    });
  }

  ngDoCheck(): void {
    // lilghtbox
    $('.image-popup-vertical-fit').magnificPopup({
      type: 'image',
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      mainClass: 'mfp-no-margins mfp-with-zoom', // clase para eliminar el margen predeterminado del lado izquierdo y derecho
      image: {
        verticalFit: true
      },
      zoom: {
        enabled: true,
        duration: 500
      }
    });
  }
  // publiccaciones de un usuario
  getPublicationsOfUser(user, page, adding = false) {
    this._publicationService.getPublicationsOfUser(this.token, user, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.items_per_page = response.items_per_page;
          this.loading = false;

          // añadir más publicacioenes
          if (!adding) {
            this.publications = response.publications;
          } else {
            // paginas actuales y visitadas
            var arrayA = this.publications;
            var arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
            // scroll automático
            $("html, body").animate({
              scrollTop: $('html').prop("scrollHeight")
            }, 1500)

          }
          // evitar que el usuario acceda a un sitio inapropiado
          if (page > this.page) {
            this._router.navigate(['/home']);
          }

        } else {
          this.status = "error";
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

  viewMore() {
    this.page += 1;
    if (this.page == this.pages) {
      this.noMore = true;
    }
    this.getPublicationsOfUser(this.user, this.page, true);
  }
  showmodal(event) {
    // recogemos el id del boton y lo formateamos
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    this.value_id = "#mod";
    this.value_id += idAttr.nodeValue;

    // abrimos el modal
    $(this.value_id)
      .modal({
        blurring: true
      })
      .modal('show')
      ;
  }
  refresh(event = null) {
    this.getPublicationsOfUser(this.user, this.page);
  }


  deletePublication(id) {
    this._publicationService.deletePublication(this.token, id).subscribe(
      response => {
        this.refresh(true)
        $(this.value_id)
        .modal('hide');
          ;
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

}

