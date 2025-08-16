(function() {
    "use strict";

    /**
     * Função principal que é executada quando o conteúdo da página é carregado.
     */
    document.addEventListener('DOMContentLoaded', function() {
        setupSmoothScroll();
        setupDualActionForm(); // Nome da função atualizado para refletir a nova lógica
        setupWhatsAppInputMask();
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
     * Envia os dados para o Formspree (para gerar um e-mail para você) E
     * redireciona o cliente para o WhatsApp com uma mensagem pré-pronta.
     */
    function setupDualActionForm() {
        const leadForm = document.getElementById('lead-form');
        if (!leadForm) return;

        leadForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão para não recarregar a página.

            // --- Coleta dos dados do formulário ---
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const restaurant = document.getElementById('restaurant').value;
            
            // --- AÇÃO 1: Enviar dados para o Formspree em segundo plano ---
            const formData = new FormData(leadForm);
            fetch(leadForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).catch(error => console.error('Erro ao enviar para o Formspree:', error));
            // O .catch é só para o caso de haver algum erro, ele não interfere no fluxo.

            // --- AÇÃO 2: Redirecionar o cliente para o WhatsApp ---
            const myWhatsAppNumber = '5521971597460';
            const message = `Olá! Desejo receber minha amostra grátis.

*Meus Dados:*
- *Nome:* ${name}
- *E-mail:* ${email}
- *WhatsApp:* ${whatsapp}
- *Restaurante:* ${restaurant}

Aguardo as instruções para enviar a foto do meu prato!`;

            const whatsappUrl = `https://api.whatsapp.com/send?phone=${myWhatsAppNumber}&text=${encodeURIComponent(message )}`;

            // Adiciona um pequeno delay para garantir que o envio ao Formspree tenha tempo de iniciar.
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500); // Meio segundo de espera.
        });
    }

    /**
     * 3. MÁSCARA DE WHATSAPP
     */
    function setupWhatsAppInputMask() {
        const whatsappInput = document.getElementById('whatsapp');
        if (!whatsappInput) return;

        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);

            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 5) {
                value = value.replace(/^(\d{2})(\d{4,5}).*/, '($1) $2');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2}).*/, '($1) ');
            } else {
                value = value.replace(/^(\d*)/, '($1');
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
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    item.classList.toggle('active');
                });
            }
        });
    }

})();
