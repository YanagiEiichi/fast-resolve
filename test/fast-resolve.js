const ava = require('ava');
const assert = require('assert');
const { fastResolve } = require('..');

ava('sync value', t => {
  let value = fastResolve(1, value => {
    assert.strictEqual(value, 1);
    return value + 1;
  });
  assert.strictEqual(value, 2);
  t.pass();
});

ava('async value', t => {
  let value = fastResolve(Promise.resolve(1), value => {
    assert.strictEqual(value, 1);
    return value + 1;
  });
  return value.then(value => {
    assert.strictEqual(value, 2);
    t.pass();
  });
});

ava('sync success handler error', t => {
  try {
    fastResolve(1, () => {
      throw new Error('hehe');
    });
  } catch (error) {
    assert.strictEqual(error.message, 'hehe');
    t.pass();
  }
});

ava('async success handler error', t => {
  return fastResolve(Promise.resolve(1), value => {
    assert.strictEqual(value, 1);
    throw new Error('hehe');
  }).catch(error => {
    assert.strictEqual(error.message, 'hehe');
    t.pass();
  });
});

ava('async success handler error', t => {
  return fastResolve(Promise.reject(new Error('haha')), null, error => {
    assert.strictEqual(error.message, 'haha');
    throw new Error('hehe');
  }).catch(error => {
    assert.strictEqual(error.message, 'hehe');
    t.pass();
  });
});

ava('no success handler on sync value', t => {
  assert.deepEqual(fastResolve(1), 1);
  t.pass();
});

ava('no success handler on async value', t => {
  return fastResolve(Promise.resolve(1)).then(value => {
    assert.deepEqual(value, 1);
    t.pass();
  });
});

ava('no failure handler on async error', t => {
  return fastResolve(Promise.reject(new Error('haha'))).catch(error => {
    assert.strictEqual(error.message, 'haha');
    t.pass();
  });
});
