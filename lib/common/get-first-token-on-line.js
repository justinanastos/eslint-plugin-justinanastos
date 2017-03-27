

module.exports = function getFirstTokenOnLine(nodeOrToken, context) {
  const sourceCode = context.getSourceCode();
  let checkToken = nodeOrToken;

  while (checkToken) {
    const tokenBefore = sourceCode.getTokenBefore(checkToken);

    if (!tokenBefore || nodeOrToken.loc.start.line !== tokenBefore.loc.start.line) {
      return checkToken;
    }

    checkToken = tokenBefore;
  }

  return checkToken;
};
