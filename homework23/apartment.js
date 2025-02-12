class Apartment {
    constructor() {
        this.residents = [];
    }
    addResident(human) {
        if (human instanceof Human) {
            this.residents.push(human);
        } else {
            console.error('Can only add instances of Human.');
        }
    }
}

export default Apartment;