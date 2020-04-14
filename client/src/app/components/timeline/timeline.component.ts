import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';

declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})

export class TimelineComponent implements OnInit, DoCheck {
  public title: string;
  public token;
  public url: string;
  public identity;
  public status: string;
  public page;
  public pages;
  public total;
  public items_per_page;
  public noMore: boolean;
  public publications: Publication[];
  public showImage;
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _publicationService: PublicationService
  ) {
    this.title = "Día a día"
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.noMore = false;
  }

  ngOnInit(): void {
    console.log("Timeline se ha cargado correctamente");
    this.getPublications(this.page);

    $(function () {
      $(document).tooltip();
    });
  }

  ngDoCheck(): void {
    // subir
    $('#top').click(function () {
      $('body,html').animate({ scrollTop: 0 }, 500);
      return true;
    });

       // lilghtbox
       $('.image-popup-vertical-fit').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
        image: {
          verticalFit: true
        },
        zoom: {
          enabled: true,
          duration: 300 // don't foget to change the duration also in CSS
        }
      });
  }
  getPublications(page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.items_per_page = response.items_per_page;

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
    this.getPublications(this.page, true);
  }

  // devolver el listado de publicaciones al insertar una nueva. con el decorador @Ouput que lo tiene el hijo sidebarComponent
  // se le llama desde el selector <sidebar> en el timelime html
  refresh(event) {
    this.getPublications(1);
  }
  showThisImage(id) {
    this.showImage = id;
  }
}
