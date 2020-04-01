import { Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url: string;
  constructor() {
    this.url = GLOBAL.url;
  }
  // enviar imagenes
  makeFilesRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
    // una vez que que esto acabe recoge los valores y seguir ejecutando el then
    return new Promise(function(resolve, reject) {
      // variable para el formulario, simular formulario.
      var formData: any = new FormData();
      // este objeto permite  hacer peticiones ajax en js puro
      var xhr = new XMLHttpRequest();
      // recorrer y adjuntar a la petición
      for (var i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
      }
      // petición ajax
      xhr.onreadystatechange = function () {
        if(xhr.readyState  == 4){
          if(xhr.status == 200){
            // devuleve respuesta correctamente
            resolve(JSON.parse(xhr.response));
          } else {
            //  si no hay respuesta no deja hacer la petición ajax
            reject(xhr.response)
          }
        }
      }
      // hacemos la petición ajax,
      xhr.open('POST', url, true);
      // adjuntar cabezera de autorización
      xhr.setRequestHeader('Authorization', token);
      // enviamos todos los datos, se enviar todas las imagenes, cabezeras.
      xhr.send(formData);

    })
  }
}
