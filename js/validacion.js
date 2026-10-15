// Reglas de validación de cada pregunta
const Validacion = {
    nombre(v) {
        v = v.trim();
        if (v.length < 2) return 'Dinos al menos 2 letras, ¡incluso un alias vale!';
        return '';
    },
    email(v) {
        v = v.trim();
        if (!v) return 'Necesitamos tu correo para mandarte el pergamino.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Ese correo se ve raro, revísalo.';
        return '';
    },
    radio(form, name) {
        return form.querySelector(`input[name="${name}"]:checked`) ? '' : 'Elige una opción para continuar.';
    },
    checks(form, name) {
        return form.querySelector(`input[name="${name}"]:checked`) ? '' : 'Marca al menos un poder.';
    },
    mensaje(v) {
        v = v.trim();
        if (v.length < 5) return 'Cuéntanos un poquito más (mínimo 5 caracteres).';
        return '';
    }
};
