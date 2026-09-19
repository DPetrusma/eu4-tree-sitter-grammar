module.exports = grammar({
  name: 'eu4mod',

  extras: $ => [/\s/, $.comment],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice($.assignment, $.comment),

    assignment: $ => seq(
      field('key', $._value),
      field('operator', choice('=', '<', '>', '<=', '>=', '!=')),
      field('value', $._value),
    ),

    _value: $ => choice(
      $.string,
      $.date,
      $.number,
      $.identifier,
      $.block,
    ),

    block: $ => seq('{', repeat(choice($._statement, $._value)), '}'),

    string: $ => /"[^"]*"/,
    date: $ => /\d{1,4}\.\d{1,2}\.\d{1,2}/,
    number: $ => /-?\d+(\.\d+)?%?/,
    identifier: $ => /[A-Za-z_][A-Za-z0-9_.:]*/,
    comment: $ => token(seq('#', /.*/)),
  }
});
