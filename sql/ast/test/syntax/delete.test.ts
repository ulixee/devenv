import { checkDelete } from '../../testing/helpers';

describe('Delete', () => {

  checkDelete([`delete from test where a = b`], {
    type: 'delete',
    from: { name: 'test' },
    where: {
      type: 'binary',
      op: '=',
      left: { type: 'ref', name: 'a' },
      right: { type: 'ref', name: 'b' },
    }
  });

  checkDelete([`delete from test`], {
    type: 'delete',
    from: { name: 'test' },
  });

  checkDelete([`delete from test returning *`], {
    type: 'delete',
    from: { name: 'test' },
    returning: [{
      expr: { type: 'ref', name: '*' }
    }]
  });
});
