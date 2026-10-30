/**
 * Minimal tree-sitter grammar for Paradox (Clausewitz) script, aimed at EU4.
 *
 * Deliberately generic: it only knows about comments, strings, `key op value`
 * pairs, `{ }` blocks and bare words. All the game-specific colouring
 * (effects, triggers, modifiers, scopes...) lives in highlights.scm and is
 * driven by regex predicates on the `identifier` text.
 */
module.exports = grammar({
  name: 'eu4script',

  extras: $ => [/\s/, $.comment],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice($.pair, $._value, $._other),

    // key = value, key > 5, key ?= value ...
    pair: $ => seq(
      field('key', $._scalar),
      field('operator', $.operator),
      field('value', $._value),
    ),

    _value: $ => choice($.block, $._scalar),

    _scalar: $ => choice($.string, $.identifier),

    block: $ => seq('{', repeat($._item), '}'),

    operator: _ => token(choice('=', '?=', '==', '<=', '>=', '!=', '<', '>')),

    // One catch-all word token: names, numbers (-5, 0.25, 10%), dates
    // (1444.11.11), scopes (ROOT.owner), event_target:foo, $MACRO$, @constants.
    // Classification happens in highlights.scm via #match? predicates.
    identifier: _ => token(/-?[A-Za-z0-9_@$][A-Za-z0-9_@$.:|'\/%\-]*/),

    string: _ => token(seq('"', repeat(choice(/[^"\\\n]+/, /\\./)), '"')),

    comment: _ => token(seq('#', /[^\n]*/)),

    // Any stray single character (`,` `;` `[` ...) so one odd byte doesn't
    // produce a parse error that disturbs highlighting of the whole block.
    _other: _ => token(prec(-1, /[^\s{}"#]/)),
  },
});
