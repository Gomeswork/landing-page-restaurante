(function() {
    "use strict";

    /**
     * Função principal que é executada quando o conteúdo da página é carregado.
     */
    document.addEventListener('DOMContentLoaded', function() {
        setupSmoothScroll();
        setupDualActionForm(); // Mantém a lógica de E-mail + WhatsApp
        setupWhatsAppInputMask(); // Usa a implementação corrigida
        setupFaqAccordion();
    });

    /**
     * 1. ROLAGEM SUAVE
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
     * 2. FORMULÁRIO DE AÇÃO DUPLA: E-MAIL E WHATSAPP
     */
    function setupDualActionForm() {
        const leadForm = document.getElementById('lead-form');
        if (!leadForm) return;

        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const restaurant = document.getElementById('restaurant').value;
            
            // AÇÃO 1: Enviar dados para o Formspree em segundo plano
            const formData = new FormData(leadForm);
            fetch(leadForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).catch(error => console.error('Erro ao enviar para o Formspree:', error));

            // AÇÃO 2: Redirecionar o cliente para o WhatsApp
            const myWhatsAppNumber = '5521971597460';
            const message = `Olá! Desejo receber minha amostra grátis.\n\n*Meus Dados:*\n- *Nome:* ${name}\n- *E-mail:* ${email}\n- *WhatsApp:* ${whatsapp}\n- *Restaurante:* ${restaurant}\n\nAguardo as instruções para enviar a foto do meu prato!`;
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${myWhatsAppNumber}&text=${encodeURIComponent(message )}`;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
        });
    }

    /**
     * 3. MÁSCARA DE WHATSAPP (VERSÃO FINAL E CORRIGIDA)
     */
    function setupWhatsAppInputMask() {
        const whatsappInput = document.getElementById('whatsapp');
        if (!whatsappInput) return;

        whatsappInput.addEventListener('input', (e) => {
            // Remove tudo que não é dígito
            let value = e.target.value.replace(/\D/g, '');
            // Limita a 11 dígitos
            value = value.substring(0, 11); 

            // Aplica a máscara de forma progressiva e segura
            if (value.length > 10) {
                // (XX) XXXXX-XXXX
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 6) {
                // (XX) XXXXX-X...
                value = value.replace(/^(\d{2})(\d{5})(.*)$/, '($1) $2-$3');
            } else if (value.length > 2) {
                // (XX) XXXXX
                value = value.replace(/^(\d{2})(.*)$/, '($1) $2');
            } else if (value.length > 0) {
                // (XX
                value = value.replace(/^(\d*)$/, '($1');
            }
            
            e.target.value = value;
        });
    }

    /**
     * 4. ACORDEÃO (FAQ)
     */
    function setupFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header) {
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

})();
