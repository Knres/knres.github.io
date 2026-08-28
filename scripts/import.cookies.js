'use strict';

export function setCookie(name, value, days) {
    const date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie =
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
        `Expires=${date.toUTCString()}; ` +
        `Path=/; ` +
        `SameSite=Lax`;
}

export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    // si no hay cookies, devolver null
    if (cookies.length === 0) {
        return null;
    }

    for (const cookie of cookies) {
        // si no hay un signo de igual, continuar con la siguiente cookie
        const separator = cookie.indexOf('=');
        if (separator === -1) continue;
        
        // decodificar el nombre de la cookie antes de compararlo
        const cookieName = decodeURIComponent(cookie.substring(0, separator));

        if (cookieName === name) {
            // comparar el nombre de la cookie con el nombre buscado
            // si coinciden, devolver el valor de la cookie decodificado
            // si no coinciden, continuar con la siguiente cookie
            return decodeURIComponent(cookie.substring(separator + 1));
        }
    }

    return null;
}

export function checkConsentimientoCookies() {
    return getCookie('consentimientoCookies');
}

export function deleteCookie(name) {
    document.cookie =
        `${encodeURIComponent(name)}=; ` +
        'Max-Age=0; ' +
        'Path=/; ' +
        'SameSite=Lax';
}

export function deleteAllCookies() {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const separator = cookie.indexOf('=');
        let name = cookie.trim(); 
        
        if (separator !== -1) {
            name = cookie.substring(0, separator).trim();
        }

        if (name) {
            deleteCookie(name);
        }
    }
}

export function aceptarCookies() {
    setCookie('consentimientoCookies', 'aceptado', 90);
    window.dispatchEvent(new Event('consentimientoCookies:aceptado'));
    eliminarBannerCookies();
}

export function rechazarCookies() {
    deleteAllCookies();
    window.dispatchEvent(new Event('consentimientoCookies:rechazado'));
    eliminarBannerCookies();
}

export function eliminarBannerCookies() {
    const banner = document.getElementById('bannerCookies');
    
    if (banner) {
        banner.remove();
    }
}