// Botón "Contacto" del menú:
//   clic izquierdo  -> baja al formulario de Formspree (#contacto)
//   clic derecho    -> abre formulario.html
(function () {
    const botones = document.querySelectorAll('.nav__links[href="#contacto"]');

    botones.forEach(boton => {
        boton.addEventListener('contextmenu', e => {
            e.preventDefault();
            window.location.href = 'formulario.html';
        });
    });
})();
