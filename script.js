(function() {
    "use strict";

    /**
     * Função principal que é executada quando o conteúdo da página é carregado.
     */
    document.addEventListener('DOMContentLoaded', function() {
        setupSmoothScroll();
        setupDualActionForm(); // Lógica corrigida para garantir a conversão
        setupWhatsAppInputMask();
        setupFaqAccordion();
    });

    /**
     * 1. ROLAGEM SUAVE
     * Navega suavemente para seções da página.
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * 2. FORMULÁRIO DE AÇÃO DUPLA (VERSÃO CORRIGIDA)
     * Garante o envio para o WhatsApp E o redirecionamento para a página de "Obrigado".
     */
    function setupDualActionForm() {
        const leadForm = document.getElementById('lead-form');
        if (!leadForm) return;

        const submitButton = leadForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.button-text');
        const loadingText = submitButton.querySelector('.loading-text');

        leadForm.addEventListener('submit', function(e) {
            // Previne o envio padrão para controlarmos o fluxo
            e.preventDefault();

            // Fornece feedback visual ao usuário
            if (buttonText && loadingText) {
                buttonText.style.display = 'none';
                loadingText.style.display = 'inline';
            }
            submitButton.disabled = true;

            // Coleta os dados do formulário
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const restaurant = document.getElementById('restaurant').value;
            
            // AÇÃO 1: Envia os dados para o Formspree em segundo plano (para seu e-mail)
            fetch(leadForm.action, {
                method: 'POST',
                body: new FormData(leadForm),
                headers: { 'Accept': 'application/json' }
            }).catch(error => console.error('Erro ao enviar para o Formspree:', error));

            // AÇÃO 2: Abre o WhatsApp em uma NOVA ABA
            const myWhatsAppNumber = '5521971597460';
            const message = `Olá! Desejo receber minha amostra grátis.\n\n*Meus Dados:*\n- *Nome:* ${name}\n- *E-mail:* ${email}\n- *WhatsApp:* ${whatsapp}\n- *Restaurante:* ${restaurant}\n\nAguardo as instruções para enviar a foto do meu prato!`;
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${myWhatsAppNumber}&text=${encodeURIComponent(message )}`;
            
            window.open(whatsappUrl, '_blank');

            // AÇÃO 3: Redireciona a ABA ATUAL para a página de "Obrigado" para registrar a conversão
            setTimeout(() => {
                window.location.href = './obrigado.html';
            }, 500); // Meio segundo de delay é suficiente
        });
    }

    /**
     * 3. MÁSCARA DE WHATSAPP
     * Formata o campo de telefone enquanto o usuário digita.
     */
    function setupWhatsAppInputMask() {
        const whatsappInput = document.getElementById('whatsapp');
        if (!whatsappInput) return;

        whatsappInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '').substring(0, 11);
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{5})(.*)$/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(.*)$/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)$/, '($1');
            }
            e.target.value = value;
        });
    }

    /**
     * 4. ACORDEÃO (FAQ)
     * Controla a abertura e fechamento das perguntas frequentes.
     */
    function setupFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header) {
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    // Fecha todos os outros itens antes de abrir o novo
                    faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

})();
