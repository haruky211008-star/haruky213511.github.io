// Validación y envío del formulario por correo (usa config.js y validacion.js)
(function () {
    const form = document.getElementById('formulario');
    const estado = document.getElementById('estado');
    const boton = document.getElementById('enviar');

    function marcar(bloque, mensaje) {
        bloque.classList.toggle('fq--bad', !!mensaje);
        const err = bloque.querySelector('.fq__error');
        if (err) err.textContent = mensaje;
        return !mensaje;
    }

    function validar() {
        const q = form.querySelectorAll('[data-q]');
        const resultados = [
            Validacion.nombre(form.nombre.value),
            Validacion.email(form.email.value),
            Validacion.radio(form, 'Nivel'),
            Validacion.checks(form, 'Quiero aprender'),
            '', // slider: siempre válido
            Validacion.mensaje(form.mensaje.value)
        ];
        let primero = null;
        resultados.forEach((msg, i) => {
            if (!marcar(q[i], msg) && !primero) primero = q[i];
        });
        if (primero) primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return !primero;
    }

    function armarDatos() {
        const d = {};
        d['Nombre'] = form.nombre.value.trim();
        d['Correo'] = form.email.value.trim();
        d['Nivel'] = form.querySelector('input[name="Nivel"]:checked').value;
        d['Quiero aprender'] = [...form.querySelectorAll('input[name="Quiero aprender"]:checked')]
            .map(c => c.value).join(', ');
        d['Emocion (1-10)'] = form.emocion.value;
        d['Mayor desastre'] = form.mensaje.value.trim();
        d['_subject'] = CONFIG.ASUNTO;
        d['_replyto'] = d['Correo'];
        d['_template'] = 'table';
        d['_captcha'] = 'false';
        d['_honey'] = form._honey.value;
        return d;
    }

    // Plan B: abre el correo del usuario con las respuestas ya escritas
    function armarMailto() {
        const d = armarDatos();
        const cuerpo = ['Nombre', 'Correo', 'Nivel', 'Quiero aprender', 'Emocion (1-10)', 'Mayor desastre']
            .map(k => k + ': ' + d[k]).join('\n');
        return 'mailto:' + CONFIG.CORREO_DESTINO + '?subject=' + encodeURIComponent(CONFIG.ASUNTO) +
            '&body=' + encodeURIComponent(cuerpo);
    }

    // Borra el error al corregir
    form.addEventListener('input', e => {
        const b = e.target.closest('[data-q]');
        if (b) { b.classList.remove('fq--bad'); b.querySelector('.fq__error') && (b.querySelector('.fq__error').textContent = ''); }
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        estado.textContent = '';
        estado.classList.remove('fstatus--err');
        if (!validar()) return;

        boton.disabled = true;
        boton.textContent = 'Enviando… ✈️';
        try {
            const r = await fetch(CONFIG.ENDPOINT + CONFIG.CORREO_DESTINO, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(armarDatos())
            });
            const j = await r.json().catch(() => ({}));
            if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'Error de envío');

            document.getElementById('nombreOk').textContent = form.nombre.value.trim().split(' ')[0];
            document.getElementById('tarjeta').hidden = true;
            document.getElementById('gracias').hidden = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Error al enviar:', err);
            const local = location.protocol === 'file:';
            estado.classList.add('fstatus--err');
            estado.innerHTML = (local
                ? 'Abriste la página como archivo local, y el envío necesita un servidor (GitHub Pages, Live Server, etc.). '
                : 'No se pudo enviar: ' + (err.message || 'error de conexión') + '. ') +
                'Mientras tanto, <a href="' + armarMailto() + '">envíalo con tu app de correo</a>.';
            boton.disabled = false;
            boton.textContent = 'Enviar mis respuestas 🚀';
        }
    });
})();
