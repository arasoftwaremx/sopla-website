import './style.css'

document.addEventListener('DOMContentLoaded', () => {
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
