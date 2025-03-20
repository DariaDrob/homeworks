const { ageClassification, weekFn } = require('./functions');

describe('ageClassification', () => {
    test('null для від’ємного віку', () => {
        expect(ageClassification(-1)).toBe(null);
    });

    test(' "Дитинство" для 0–24', () => {
        expect(ageClassification(0)).toBe('Дитинство');
        expect(ageClassification(1)).toBe('Дитинство');
        expect(ageClassification(24)).toBe('Дитинство');
    });

    test(' "Молодість" для 24.01–44', () => {
        expect(ageClassification(24.01)).toBe('Молодість');
        expect(ageClassification(44)).toBe('Молодість');
    });

    test(' "Зрілість" для 44.01–65', () => {
        expect(ageClassification(44.01)).toBe('Зрілість');
        expect(ageClassification(65)).toBe('Зрілість');
    });

    test(' "Старість" для 65.1–75', () => {
        expect(ageClassification(65.1)).toBe('Старість');
        expect(ageClassification(75)).toBe('Старість');
    });

    test(' "Довголіття" для 75.01–90', () => {
        expect(ageClassification(75.01)).toBe('Довголіття');
        expect(ageClassification(90)).toBe('Довголіття');
    });

    test(' "Рекорд" для 90.01–122', () => {
        expect(ageClassification(90.01)).toBe('Рекорд');
        expect(ageClassification(122)).toBe('Рекорд');
    });

    test(' null для віку понад 122', () => {
        expect(ageClassification(122.01)).toBe(null);
        expect(ageClassification(150)).toBe(null);
    });
});

describe('weekFn', () => {
    test(' правильний день для чисел 1–7', () => {
        expect(weekFn(1)).toBe('Понеділок');
        expect(weekFn(2)).toBe('Вівторок');
        expect(weekFn(3)).toBe('Середа');
        expect(weekFn(4)).toBe('Четвер');
        expect(weekFn(5)).toBe('П\'ятниця');
        expect(weekFn(6)).toBe('Субота');
        expect(weekFn(7)).toBe('Неділя');
    });

    test('повертає null для некоректних значень', () => {
        expect(weekFn(9)).toBe(null);
        expect(weekFn(1.5)).toBe(null);
        expect(weekFn('2')).toBe(null);
    });
});