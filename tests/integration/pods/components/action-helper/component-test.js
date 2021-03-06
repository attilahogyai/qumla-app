import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('action-helper', 'Integration | Component | action helper', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{action-helper}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#action-helper}}
      template block text
    {{/action-helper}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
