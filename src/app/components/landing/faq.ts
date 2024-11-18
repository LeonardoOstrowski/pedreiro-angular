import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  template: `
    <div class="faq">
      <h2>Perguntas Frequentes</h2>
      <div class="faq-item">
        <p class="question">1 - Você oferece garantia do seu serviço?</p>
        <p class="answer">Sim, todos os nossos serviços têm garantia de qualidade. Em caso de problemas, basta nos
          contatar que resolveremos o mais rápido possível.</p>
      </div>
      <div class="faq-item">
        <p class="question">2 - Você pode me ajudar com o planejamento e a compra dos materiais?</p>
        <p class="answer">Sim, oferecemos consultoria completa para planejamento e compra de materiais, com indicações
          de fornecedores confiáveis.</p>
      </div>
      <div class="faq-item">
        <p class="question">3 - Quais são suas formas de pagamento?</p>
        <p class="answer">Aceitamos pagamento em dinheiro, transferência bancária e cartões de crédito. Parcelamentos
          podem ser negociados.</p>
      </div>
      <div class="faq-item">
        <p class="question">4 - Você atende em quais regiões?</p>
        <p class="answer">Atendemos principalmente na região metropolitana, mas também aceitamos projetos em cidades
          próximas mediante avaliação.</p>
      </div>
      <div class="faq-item">
        <p class="question">5 - É necessário que eu esteja em casa durante a execução da obra?</p>
        <p class="answer">Não necessariamente, mas recomendamos que esteja disponível para eventuais dúvidas e ajustes
          necessários.</p>
      </div>
      <div class="faq-item">
        <p class="question">6 - Você também faz serviços elétricos ou hidráulicos?</p>
        <p class="answer">Trabalhamos em parceria com profissionais qualificados para serviços elétricos e hidráulicos,
          caso precise.</p>
      </div>
      <div class="faq-item">
        <p class="question">7 - Como faço para acompanhar o progresso da obra?</p>
        <p class="answer">Oferecemos atualizações regulares sobre o andamento do projeto e também visitas ao local
          conforme sua disponibilidade.</p>
      </div>
      <div class="faq-item">
        <p class="question">8 - O que faço se algo der errado após a obra estar concluída?</p>
        <p class="answer">Estamos disponíveis para assistência pós-obra. Se surgir qualquer problema, entre em contato e
          faremos os reparos necessários.</p>
      </div>
    </div>
  `
})
export class FAQComponent {}
