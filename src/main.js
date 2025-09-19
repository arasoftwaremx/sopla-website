import './style.css'

document.addEventListener('DOMContentLoaded', () => {

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');

        const toast = document.createElement('div');
        const baseClasses = 'max-w-sm p-4 rounded-lg shadow-lg text-white font-medium transform translate-x-full transition-transform duration-300 ease-in-out';
        const typeClasses = type === 'success'
            ? 'bg-green-500 border-l-4 border-green-600'
            : 'bg-red-500 border-l-4 border-red-600';

        toast.className = `${baseClasses} ${typeClasses}`;
        toast.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex items-start">
                    <div class="mr-3 mt-0.5">
                        ${type === 'success'
                ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
                : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
            }
                    </div>
                    <div>
                        <p class="text-sm">${message}</p>
                    </div>
                </div>
                <button class="ml-4 text-white hover:text-gray-200 transition-colors" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }

    let isSubmitting = false;
    let lastSubmissionTime = 0;
    const COOLDOWN_TIME = 5000;

    document.getElementById('form').addEventListener('submit', function (e) {
        e.preventDefault()

        const currentTime = Date.now();
        const submitButton = document.getElementById('btn-save');

        if (isSubmitting) {
            showToast('El formulario ya se está enviando. Por favor espera.', 'error');
            return;
        }

        if (currentTime - lastSubmissionTime < COOLDOWN_TIME) {
            const remainingTime = Math.ceil((COOLDOWN_TIME - (currentTime - lastSubmissionTime)) / 1000);
            showToast(`Espera ${remainingTime} segundos antes de enviar otro correo.`, 'error');
            return;
        }

        isSubmitting = true;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
            </div>
        `;
        submitButton.classList.add('opacity-75', 'cursor-not-allowed');

        const serviceID = 'default_service';
        const templateID = 'template_ra2s6gp';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                showToast('Correo enviado exitosamente', 'success');
                this.reset();
                lastSubmissionTime = currentTime;
            }, (error) => {
                showToast('Error al enviar el correo. Por favor, inténtalo de nuevo.', 'error');
                console.error('Error:', error);
            })
            .finally(() => {
                // Restaurar botón
                isSubmitting = false;
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar';
                submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
            });
    })


    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');

    function openMenu() {
        mobileMenu.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    }

    function closeMenu() {
        mobileMenu.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }

    if (menuButton && mobileMenu && closeMenuButton && overlay) {
        menuButton.addEventListener('click', openMenu);
        closeMenuButton.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                closeMenu();

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
