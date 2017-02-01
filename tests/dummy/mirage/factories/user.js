import { Factory, faker } from 'ember-cli-mirage';

function pad(number, digits) {
  let str = String(number);
  let pad = Array.from({ length: digits }).map(() => '0').join('');

  return pad.substring(0, pad.length - str.length) + str;
}

export default Factory.extend({
  firstName() {
    return faker.name.firstName();
  },

  nickName() {
    return faker.name.firstName();
  },

  lastName() {
    return faker.name.lastName();
  },

  age() {
    return faker.random.number({ min: 5, max: 90 });
  },

  ssn() {
    let three = pad(faker.random.number({ max: 999 }), 3);
    let two = pad(faker.random.number({ max: 99 }), 2);
    let four = pad(faker.random.number({ max: 9999 }), 4);

    return `${three}-${two}-${four}`;
  },

  city() {
    return faker.address.city()
  },

  streetAddress() {
    return faker.address.streetAddress()
  }
});
