const ava = require('ava');
const assert = require('assert');
const { fastResolveAll } = require('..');

ava('sync values', t => {
  let value = fastResolveAll([ 1, 2, 3 ], value => {
    assert.deepEqual(value, [ 1, 2, 3 ]);
    return 'ok';
  });
  assert.strictEqual(value, 'ok');
  t.pass();
});

ava('async values', t => {
  let value = fastResolveAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ], value => {
    assert.deepEqual(value, [ 1, 2, 3 ]);
    return 'ok';
  });
  return value.then(value => {
    assert.strictEqual(value, 'ok');
    t.pass();
  });
});

ava('async rejected value in values', t => {
  let value = fastResolveAll([
    Promise.resolve(1),
    Promise.reject(new Error('error')),
    Promise.resolve(3)
  ], () => {
    throw new Error('wtf');
  }, value => {
    return 'ok';
  });
  return value.then(value => {
    assert.strictEqual(value, 'ok');
    t.pass();
  });
});

ava('hybrid values', t => {
  let value = fastResolveAll([
    Promise.resolve(1),
    2,
    Promise.resolve(3)
  ], value => {
    assert.deepEqual(value, [ 1, 2, 3 ]);
    return 'ok';
  });
  return value.then(value => {
    assert.strictEqual(value, 'ok');
    t.pass();
  });
});

ava('async success handler error', t => {
  let value = fastResolveAll([ Promise.resolve(1) ], value => {
    assert.deepEqual(value, [ 1 ]);
    throw new Error('hehe');
  });
  return value.catch(error => {
    assert.strictEqual(error.message, 'hehe');
    t.pass();
  });
});

ava('async failure handler error', t => {
  let value = fastResolveAll([ Promise.reject(new Error('haha')) ], null, error => {
    assert.strictEqual(error.message, 'haha');
    throw new Error('hehe');
  });
  return value.catch(error => {
    assert.strictEqual(error.message, 'hehe');
    t.pass();
  });
});

ava('sync success handler error', t => {
  try {
    fastResolveAll([ 1 ], () => {
      throw new Error('hehe');
    });
  } catch (error) {
    assert.strictEqual(error.message, 'hehe');
    t.pass();
  }
});

ava('no success handler on sync value', t => {
  assert.deepEqual(fastResolveAll([ 1 ]), [ 1 ]);
  t.pass();
});

ava('no success handler on async value', t => {
  return fastResolveAll([ Promise.resolve(1) ]).then(value => {
    assert.deepEqual(value, [ 1 ]);
    t.pass();
  });
});

ava('no failure handler on async error', t => {
  return fastResolveAll([ Promise.reject(1) ]).catch(value => {
    assert.strictEqual(value, 1);
    t.pass();
  });
});
