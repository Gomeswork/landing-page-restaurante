(function() {
    "use strict";

    document.addEventListener('DOMContentLoaded', function() {

        /**
         * 1. SMOOTH SCROLL PARA LINKS INTERNOS
         * Adiciona um efeito de rolagem suave para todas as âncoras (links com #).
         */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        /**
         * 2. MANIPULAÇÃO DO FORMULÁRIO (NETLIFY)
         * Fornece feedback visual durante o envio e valida os campos.
         */
        const leadForm = document.getElementById('lead-form');
        if (leadForm) {
            leadForm.addEventListener('submit', function(e) {
                // Validações do lado do cliente para melhor UX
                const whatsappInput = document.getElementById('whatsapp');
                const whatsappNumbers = whatsappInput.value.replace(/\D/g, '');
                if (whatsappNumbers.length < 10 || whatsappNumbers.length > 11) {
                    e.preventDefault(); // Impede o envio do formulário
                    alert('Por favor, insira um número de WhatsApp válido com DDD.');
                    return;
                }

                const photoInput = document.getElementById('photo');
                if (photoInput.files.length > 0 && photoInput.files[0].size > 10 * 1024 * 1024) { // 10MB
                    e.preventDefault();
                    alert('O arquivo da foto deve ter no máximo 10MB.');
                    return;
                }

                // Se a validação passar, mostra o estado de carregamento
                const submitButton = leadForm.querySelector('button[type="submit"]');
                const buttonText = submitButton.querySelector('.button-text');
                const loadingText = submitButton.querySelector('.loading-text');

                if (buttonText && loadingText) {
                    buttonText.style.display = 'none';
                    loadingText.style.display = 'inline';
                }
                submitButton.disabled = true;

                // O formulário será enviado para o Netlify.
                // Opcional: mostrar uma mensagem de sucesso imediatamente.
                const name = document.getElementById('name').value || 'Cliente';
                setTimeout(() => showSuccessMessage(name), 500);
            });
        }

        /**
         * 3. MÁSCARA AUTOMÁTICA PARA WHATSAPP
         * Formata o campo de telefone enquanto o usuário digita.
         */
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) {
            whatsappInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.substring(0, 11); // Limita a 11 dígitos (DDD + 9 dígitos)
                
                if (value.length > 2) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                }
                if (value.length > 9) {
                    value = `${value.substring(0, 10)}-${value.substring(10)}`;
                }
                e.target.value = value;
            });
        }

        /**
         * 4. ACORDEÃO (FAQ)
         * Alterna a visibilidade das respostas ao clicar nas perguntas.
         */
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const header = item.querySelector('h3');
            header.addEventListener('click', () => {
                // Fecha todos os outros itens antes de abrir o novo
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Alterna a classe 'active' no item clicado
                item.classList.toggle('active');
            });
        });

    }); // Fim do DOMContentLoaded

    /**
     * FUNÇÃO AUXILIAR: MOSTRAR MODAL DE SUCESSO
     * Cria e exibe um popup de agradecimento.
     */
    function showSuccessMessage(name) {
        const modalHTML = `
            <div class="success-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 10000;">
                <div class="modal-content" style="background: white; padding: 40px; border-radius: 10px; text-align: center; max-width: 500px; margin: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div style="color: #28a745; font-size: 48px; margin-bottom: 20px;">✅</div>
                    <h3 style="color: #333; margin-bottom: 15px; font-size: 1.5rem; text-align: center;">Obrigado, ${name}!</h3>
                    <p style="color: #666; margin-bottom: 20px; text-align: center;">Recebemos sua solicitação! Nossa equipe enviará sua amostra grátis em até 24 horas.</p>
                    <p style="color: #888; font-size: 14px; margin-bottom: 25px; text-align: center;">Verifique sua caixa de entrada e spam.</p>
                    <button class="close-modal-btn" style="background: linear-gradient(135deg, #FF4757, #FFA502); color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px;">Fechar</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.querySelector('.success-modal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('close-modal-btn')) {
                modal.remove();
            }
        });
    }

})();
