const getFirstTokenOnLine = require('./get-first-token-on-line');

module.exports = function getLeadingWhitespaceLength(context, nodeOrToken) {
  const firstTokenOnLine = getFirstTokenOnLine(nodeOrToken, context);

  return firstTokenOnLine.loc.start.column;
};
