function PropertyComponentTransform() {
  this.syntax = null;
}

function recursiveTransform(syntax, builders, node) {
  syntax.traverse(node, {
    BlockStatement: function(node) {
      if (node.path.original === 'fm-form' && node.program.blockParams.length) {
        var fieldParam = node.program.blockParams[0];
        var modelPath = node.params[0].original;

        recursiveTransform(syntax, builders, node.program);

        syntax.traverse(node.program, {
          BlockStatement: function(node) {
            if (node.path.parts[0] === fieldParam) {
              var valuePathString = node.path.parts.slice(1).join('.');

              var value = builders.sexpr('mut', [ builders.path([].concat(modelPath, valuePathString).join('.')) ]);
              var valuePath = builders.string(valuePathString);
              var validation = builders.sexpr('mut', [ builders.path([].concat(modelPath, 'validations.attrs', valuePathString).join('.')) ]);

              node.path = builders.path('fm-field');

              node.hash.pairs = node.hash.pairs.concat(
                builders.pair('value', value),
                builders.pair('valuePath', valuePath),
                builders.pair('validation', validation)
              );
            }
          }
        });
      }
    }
  });
}

PropertyComponentTransform.prototype.transform = function(ast) {
  recursiveTransform(this.syntax, this.syntax.builders, ast);

  return ast;
};

module.exports = PropertyComponentTransform;
