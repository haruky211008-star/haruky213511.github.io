// Envío del formulario de contacto a Formspree (sin recargar la página)
(function () {
    const form = document.getElementById('formContacto');
    if (!form) return;
    const msg = document.getElementById('cMsg');
    const btn = document.getElementById('cBtn');

    form.addEventListener('submit', async e => {
        e.preventDefault();
        msg.className = 'cform__msg';
        msg.textContent = '';
        btn.disabled = true;
        btn.textContent = 'Enviando…';
        try {
            const r = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (!r.ok) {
                const j = await r.json().catch(() => ({}));
                throw new Error((j.errors && j.errors.map(x => x.message).join(', ')) || 'Error ' + r.status);
            }
            form.reset();
            msg.classList.add('cform__msg--ok');
            msg.textContent = '¡Gracias! Recibimos tus respuestas 🎉';
        } catch (err) {
            msg.classList.add('cform__msg--err');
            msg.textContent = 'No se pudo enviar (' + err.message + '). Inténtalo de nuevo.';
        }
        btn.disabled = false;
        btn.textContent = 'Enviar respuestas';
    });
})();
