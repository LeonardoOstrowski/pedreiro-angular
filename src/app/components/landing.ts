import { Component } from '@angular/core';
import {HeaderComponent} from "./landing/header";
import {BannerComponent} from "./landing/banner";
import {AfiliacoesComponent} from "./landing/afiliacoes";
import {BiografiaComponent} from "./landing/biografia";
import {ServicesComponent} from "./landing/services";
import {FAQComponent} from "./landing/faq";
import {FooterComponent} from "./landing/footer";

@Component({
    selector: 'app-landing',
    template: `
        <app-header></app-header>
        <app-banner></app-banner>
        <app-afiliacoes></app-afiliacoes>
        <app-biografia></app-biografia>
        <app-services></app-services>
        <app-faq></app-faq>
        <app-footer></app-footer>
    `,
    styleUrls: ['../app.component.scss'],
    standalone: true,

    imports: [
        HeaderComponent,
        BannerComponent,
        AfiliacoesComponent,
        BiografiaComponent,
        ServicesComponent,
        FAQComponent,
        FooterComponent
    ]
})
export class LandingComponent {}
