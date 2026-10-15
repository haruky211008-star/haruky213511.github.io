// Detalles de interfaz: slider con emojis y contador de caracteres
(function () {
    const range = document.getElementById('emocion');
    const val = document.getElementById('emocionVal');
    const emoji = document.getElementById('emoji');
    const caras = ['😴', '😐', '🙂', '🙂', '😀', '😄', '🤩', '🤩', '🚀', '🔥'];

    range.addEventListener('input', () => {
        val.textContent = range.value;
        emoji.textContent = caras[range.value - 1];
    });

    const area = document.getElementById('mensaje');
    const cont = document.getElementById('contador');
    area.addEventListener('input', () => { cont.textContent = area.value.length; });
})();
