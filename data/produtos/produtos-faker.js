const faker = require('faker');


const people = []
for (let i = 0; i < 10; i++) {
	const person = {
		id: faker.random.number(100),
		descricao: faker.commerce.product(),
		valor: faker.finance.amount(5, 10, 2, 'R$'),
		marca: faker.company.companyName(),
	}
	people.push(person)
}

module.exports = {
    people
}