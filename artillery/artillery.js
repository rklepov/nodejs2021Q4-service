// artillery.js

let userSeqNo = 0;

function beforePostUsers(requestParams, context, ee, next) {
  context.vars['userSeqNo'] = userSeqNo++;

  return next();
}

function afterPostUsers(requestParams, response, context, ee, next) {
  if (!context.vars['userIds']) {
    context.vars['userIds'] = [];
  }
  context.vars['userIds'].push(context.vars['Id']);
  context.vars[`userId-${context.vars['$loopCount']}`] = context.vars['Id'];

  return next();
}

module.exports = {
  beforePostUsers,
  afterPostUsers,
};

//__EOF__
