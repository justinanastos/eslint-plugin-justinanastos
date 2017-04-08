module.exports = function getTextBetweenNodesOrTokens(context, nodeOrTokenA, nodeOrTokenB) {
  const sourceCode = context.getSourceCode();
  const text = sourceCode.getText();
  const start = nodeOrTokenA.end;
  const length = nodeOrTokenB.start - nodeOrTokenA.end;
  const contentBetween = text.substr(start, length);

  return contentBetween;
};
