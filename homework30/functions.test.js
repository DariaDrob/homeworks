import { isValidEmail, isValidUrl } from './functions.js';

describe('isValidEmail', () => {
    test('true для валідного email', () => {
        expect(isValidEmail('example@example.com')).toBe(true);
        expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
    });

    test('false для невалідного email', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('test@.com')).toBe(false);
        expect(isValidEmail('')).toBe(false);
    });
});

describe('isValidUrl', () => {
    test('true для валідного URL', () => {
        expect(isValidUrl('https://www.example.com')).toBe(true);
        expect(isValidUrl('http://example.com/path')).toBe(true);
        expect(isValidUrl('www.google.com')).toBe(true);
    });

    test('false для невалідного URL', () => {
        expect(isValidUrl('invalid-url')).toBe(false);
        expect(isValidUrl('http://')).toBe(false);
        expect(isValidUrl('')).toBe(false);
    });
});