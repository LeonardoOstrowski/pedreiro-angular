import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section location">
          <img src="https://imgur.com/ytKEGf8.png" alt="Logo" class="logo"/>
          <p>Ponto de acesso perto da estação autódromo</p>
          <p>ㅤ</p>
          <p>Endereço: Rua fulandital<br/>CEP: 98765-444</p>
        </div>

        <div class="footer-section subscribe">
          <label for="email">Seu Email</label>
          <div class="subscribe-container">
            <input type="email" id="email" placeholder="exemplo@email.com"/>
            <button type="submit">Subscribe</button>
          </div>
        </div>

        <div class="footer-section links">
          <h3>Links</h3>
          <ul>
            <li><a href="#">Contate-me</a></li>
            <li><a href="#">Sobre mim</a></li>
            <li><a href="#">Carreira</a></li>
          </ul>
        </div>

        <div class="footer-section social">
          <h3>Redes sociais</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>copyright © 2024</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}
