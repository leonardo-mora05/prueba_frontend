function validarNombre(nombre) {
    // solo letras y espacios, mínimo 3 caracteres y soporte para acentos y ñ
    const regex = /^[a-záéíóúñ\s]{3,}$/i;
    return regex.test(nombre.trim());
}

function validarEmail(email) {
    // formato básico email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

function validarTelefono(telefono) {
    // Solo números, símbolos de teléfono mínimo 8 caracteres
    const regex = /^[\d\+\-\s()]{8,}$/;
    return regex.test(telefono.trim());
}

function validarAsunto(asunto) {
    // Mínimo 5 caracteres
    return asunto.trim().length >= 5;
}

// Mostrar error
function mostrarError(inputId, mensajeId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(mensajeId);
    
    input.classList.add('input-error');
    error.textContent = mensaje;
    error.classList.add('mostrar');
}

// Limpiar error
function limpiarError(inputId, mensajeId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(mensajeId);
    
    input.classList.remove('input-error');
    error.textContent = '';
    error.classList.remove('mostrar');
}

// Generar CSV
function generarCSV(datos) {
    let csv = 'Nombre,Email,Teléfono,Asunto,Fecha\n';
    
    // Datos
    const fila = [
        `"${datos.nombre}"`,
        `"${datos.email}"`,
        `"${datos.telefono}"`,
        `"${datos.asunto}"`,
        `"${datos.fecha}"`
    ].join(',');
    
    csv += fila + '\n';
    
    return csv;
}

// Descargar CSV
function descargarCSV(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function guardarEnLocal(datos) {
    let registros = JSON.parse(localStorage.getItem('formularioRegistros')) || [];
    
    registros.push(datos);
    
    localStorage.setItem('formularioRegistros', JSON.stringify(registros));
    
    return registros;
}

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('miFormulario');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const asunto = document.getElementById('asunto').value;
            
            let formularioValido = true;
            
            // Validar nombre
            if (!validarNombre(nombre)) {
                mostrarError('nombre', 'errorNombre', 'Nombre inválido (mínimo 3 letras)');
                formularioValido = false;
            } else {
                limpiarError('nombre', 'errorNombre');
            }
            
            // Validar email
            if (!validarEmail(email)) {
                mostrarError('email', 'errorEmail', 'Email inválido (ej: correo@ejemplo.com)');
                formularioValido = false;
            } else {
                limpiarError('email', 'errorEmail');
            }
            
            // Validar teléfono
            if (!validarTelefono(telefono)) {
                mostrarError('telefono', 'errorTelefono', 'Teléfono inválido (mínimo 8 dígitos)');
                formularioValido = false;
            } else {
                limpiarError('telefono', 'errorTelefono');
            }
            
            // Validar asunto
            if (!validarAsunto(asunto)) {
                mostrarError('asunto', 'errorAsunto', 'Asunto inválido (mínimo 5 caracteres)');
                formularioValido = false;
            } else {
                limpiarError('asunto', 'errorAsunto');
            }
            
            if (formularioValido) {
                const datos = {
                    nombre: nombre,
                    email: email,
                    telefono: telefono,
                    asunto: asunto,
                    fecha: new Date().toLocaleString('es-CL')
                };
                
                // Guardar en local
                guardarEnLocal(datos);
                
                // Generar y descargar CSV
                const csv = generarCSV(datos);
                descargarCSV(csv, 'consulta_' + Date.now() + '.csv');
                
                // Mostrar alerta
                alert('Formulario enviado correctamente');
                
                // Limpiar formulario
                formulario.reset();
            }
        });
    }
});
