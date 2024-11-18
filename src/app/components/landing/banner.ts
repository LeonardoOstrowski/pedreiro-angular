import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  template: `
    <div class="banner">
      <div class="bio">
        <h2>João, um pedreiro de 35 anos...</h2>
        <p>
          João, um pedreiro de 35 anos de uma pequena cidade, aprendeu o ofício
          ajudando seu pai. Com habilidades em alvenaria, ele ganhou reconhecimento
          pela qualidade de seu trabalho.
        </p>
        <button class="button">Biografia</button>
      </div>
      <img src="https://imgur.com/whkEWXF.png" alt="João, o pedreiro" class="banner-image"/>
    </div>
  `
})
export class BannerComponent {}
