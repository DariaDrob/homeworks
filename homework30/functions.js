function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    const urlRegex = /^(https?:\/\/)?([^\s.]+\.)+[^\s.]{2,}(\/.*)?$/;
    return urlRegex.test(url);
}

export { isValidEmail, isValidUrl };