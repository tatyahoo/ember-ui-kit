import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  title() {
    return faker.lorem.sentence(3);
  },

  subtitle() {
    return faker.lorem.sentence();
  },

  content() {
    return faker.lorem.paragraphs();
  }
});
