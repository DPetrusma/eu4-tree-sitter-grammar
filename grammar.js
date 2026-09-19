/**
 * @file Grammer for the DSL for writing mods for Europa Universalis IV
 * @author Malte Lau Petersen <maltelau@mlpetersen.dk>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const {
  /* import from different file */
  LOGIC,
  GENERIC_SCOPES,
  SPECIAL_FLAG_SCOPES,

  COUNTRY_EFFECT_SCOPE,
  PROVINCE_EFFECT_SCOPE,
  COUNTRY_TO_PROVINCE_EFFECT_SCOPE,
  PROVINCE_TO_COUNTRY_EFFECT_SCOPE,
  COUNTRY_TO_COUNTRY_EFFECT_SCOPE,
  PROVINCE_TO_PROVINCE_EFFECT_SCOPE,

  COUNTRY_TRIGGER_SCOPE,
  PROVINCE_TRIGGER_SCOPE,
  COUNTRY_TO_PROVINCE_TRIGGER_SCOPE,
  PROVINCE_TO_COUNTRY_TRIGGER_SCOPE,
  COUNTRY_TO_COUNTRY_TRIGGER_SCOPE,
  PROVINCE_TO_PROVINCE_TRIGGER_SCOPE,

  UNIT_TRIGGER_STATEMENTS_NUM,
  UNIT_TRIGGER_STATEMENTS_BOOL,
  UNIT_TRIGGER_STATEMENTS_STR,

  COUNTRY_EFFECT_STATEMENTS_NUM,
  COUNTRY_EFFECT_STATEMENTS_BOOL,
  COUNTRY_EFFECT_STATEMENTS_IDENT,
  COUNTRY_EFFECT_STATEMENTS_STR,
  COUNTRY_EFFECT_STATEMENTS_PROV,
  COUNTRY_EFFECT_STATEMENTS_TAG,
  COUNTRY_EFFECT_STATEMENTS_VARIABLE,

  COUNTRY_TRIGGER_STATEMENTS_NUM,
  COUNTRY_TRIGGER_STATEMENTS_BOOL,
  COUNTRY_TRIGGER_STATEMENTS_IDENT,
  COUNTRY_TRIGGER_STATEMENTS_STR,
  COUNTRY_TRIGGER_STATEMENTS_TAG,
  COUNTRY_TRIGGER_STATEMENTS_PROV,

  PROVINCE_EFFECT_STATEMENTS_NUM,
  PROVINCE_EFFECT_STATEMENTS_BOOL,
  PROVINCE_EFFECT_STATEMENTS_IDENT,
  PROVINCE_EFFECT_STATEMENTS_STR,
  PROVINCE_EFFECT_STATEMENTS_TAG,
  PROVINCE_EFFECT_STATEMENTS_PROV,
  PROVINCE_EFFECT_STATEMENTS_VARIABLE,

  PROVINCE_TRIGGER_STATEMENTS_NUM,
  PROVINCE_TRIGGER_STATEMENTS_BOOL,
  PROVINCE_TRIGGER_STATEMENTS_IDENT,
  PROVINCE_TRIGGER_STATEMENTS_STR,
  PROVINCE_TRIGGER_STATEMENTS_TAG,
  PROVINCE_TRIGGER_STATEMENTS_PROV,

  ON_ACTION_COUNTRY,
  ON_ACTION_PROVINCE,
  ON_ACTION_UNIT,

  EXPORTABLE_VALUE_COUNTRY,
  EXPORTABLE_VALUE_PROVINCE,

  MODIFIER_GLOBAL_NUM,
  MODIFIER_GLOBAL_BOOL,
  MODIFIER_LOCAL_NUM,
  MODIFIER_LOCAL_BOOL,
} = require("./imports/vanilla_statements.js");

const grammar_gui = require("./imports/grammar_gui.js");

// const { precompiled_imports } = require("./imports/scripted_effect_parsed.js");

/* ####### Grammar begins ######### */
rules = {
  source_file: ($) =>
    choice(
      $.events_file,
      $.on_actions_file,
      $.scripted_effects_file,
      $.decisions_file,
      $.missions_file,
      $.modifiers_file,
      $.church_aspects_file,
      $.estate_privileges_file,
      $.dot_mod_file,
      $.dot_gfx_file,
      $.dot_gui_file,
      $.dot_yml_file,
      $.custom_gui_file,
    ),

  // TODO: better number parsing
  number: ($) => choice($.number_negative, $.number_positive),
  number_negative: ($) => /\-(0|([1-9][0-9]*))(\.[0-9]+)?/,
  number_positive: ($) => /(0|([1-9][0-9]*))(\.[0-9]+)?/,
  int_nonnull: ($) => /[1-9][0-9]*/,
  integer: ($) => token(seq(optional("-"), /\d+/)),
  operator: ($) => prec(-1, /\+|-/),

  /* Generic */
  eq: ($) => "=",
  string: ($) => /"[^"]*"/,
  bool: ($) => prec(1, /(yes)|(no)/),
  comment: ($) => /#.*/,

  _bool_truefalse: ($) => alias(choice("true", "false"), $.bool),
  _bool_0_1: ($) => alias(choice("0", "1"), $.bool),

  tag: ($) => prec(1, /([A-Z][0-9]{1,3})|(REB)|(NAT)|(---)|(SS[0-9])/),
  province: ($) => prec(1, $.int_nonnull),
  area: ($) => prec(1, /[a-z][a-z0-9_]*_area/),
  region: ($) => prec(1, /[a-z][a-z\_]*_(super)?region/), // TODO: split into superregion and continent etc
  province_group: ($) => /[a-z][a-z_]*_((group)|(provinces))/, // TODO:_ had prec(1) but this breaks scripted things that end in _group

  /* Keywords */
  if_ident: ($) => /if|If/, // TODO: case sensitive?
  limit_ident: ($) => "limit",
  else_if_ident: ($) => "else_if",
  else_ident: ($) => "else",
  estate_influence_ident: ($) => "estate_influence",
  custom_trigger_tooltip_ident: ($) => "custom_trigger_tooltip",
  id_ident: ($) => "id",
  title_ident: ($) => "title",
  desc_ident: ($) => "desc",
  picture_ident: ($) => "picture",
  major_trigger_ident: ($) => "major_trigger",
  trigger_ident: ($) => "trigger",
  immediate_ident: ($) => "immediate",
  after_ident: ($) => "after",
  option_ident: ($) => "option",
  add_opinion_ident: ($) => "add_opinion",
  modifier_ident: ($) => "modifier",
  multiplier_ident: ($) => "multiplier",
  years_ident: ($) => "years",
  tooltip_ident: ($) => "tooltip",
  country_event_ident: ($) => "country_event",
  hidden_effect_ident: ($) => "hidden_effect",
  hidden_trigger_ident: ($) => "hidden_trigger",
  add_country_modifier_ident: ($) =>
    choice("add_country_modifier", "add_permanent_country_modifier"),
  name_ident: ($) => "name",
  duration_ident: ($) => "duration",
  kill_units_ident: ($) => "kill_units",
  who_ident: ($) => "who",
  type_ident: ($) => "type",
  amount_ident: ($) => "amount",
  add_province_modifier_ident: ($) =>
    choice("add_province_modifier", "add_permanent_province_modifier"),
  province_event_ident: ($) => "province_event",
  random_ident: ($) => "random",
  days_ident: ($) => "days",
  has_great_project_ident: ($) => "has_great_project",
  events_ident: ($) => "events",
  random_events_ident: ($) => "random_events",
  hidden_ident: ($) => "hidden",
  change_country_color_ident: ($) => "change_country_color",
  color_ident: ($) => "color",
  country_ident: ($) => "country",
  any_ident: ($) => /(any)|(ANY)/,
  all_ident: ($) => /(all)|(ALL)/,
  chance_ident: ($) => "chance",
  random_list_ident: ($) => "random_list",
  tier_ident: ($) => "tier",
  trigger_switch_ident: ($) => "trigger_switch",
  on_trigger_ident: ($) => "on_trigger",
  factor_ident: ($) => "factor",
  ai_importance_ident: ($) => "ai_importance",
  ai_will_do_ident: ($) => "ai_will_do",
  calc_true_if_ident: ($) => "calc_true_if",
  exclude_from_progress_ident: ($) => "exclude_from_progress",
  event_target_full_ident: ($) => /event_target:[a-zA-Z0-9][a-zA-Z0-9._]*/,
  trigger_value_full_ident: ($) => /trigger_value:[a-zA-Z0-9][a-zA-Z0-9._]*/,
  modifier_value_full_ident: ($) => /modifier:[a-zA-Z0-9][a-zA-Z0-9._]*/,
  variable_full_ident: ($) => /variable:[a-zA-Z0-9][a-zA-Z0-9._]*/,
  num_of_provinces_owned_ident: ($) =>
    prec(
      1,
      /(num_of_owned_provinces_with)|(num_of_provinces_owned_or_owned_by_non_sovereign_subjects_with)|(num_of_provinces_owned_or_owned_by_subjects_with)/,
    ),
  value_ident: ($) => "value",
  cost_ident: ($) => "cost",
  sprite_ident: ($) => "sprite",
  conditional_modifier_ident: ($) => "conditional_modifier",
  influence_scaled_conditional_modifier_ident: ($) =>
    "influence_scaled_conditional_modifier",
  on_granted_province_ident: ($) => "on_granted_province",
  on_revoked_province_ident: ($) => "on_revoked_province",
  on_invalid_province_ident: ($) => "on_invalid_province",
  is_bad_ident: ($) => "is_bad",
  mechanics_ident: ($) => "mechanics",
  land_share_ident: ($) => "land_share",
  influence_ident: ($) => "influence",
  loyalty_ident: ($) => "loyalty",
  cooldown_years_ident: ($) => "cooldown_years",
  max_absolutism_ident: ($) =>
    prec.left(
      "max_absolutism",
    ) /* can be both an argument in a estate priv, and a modifier */,
  can_select_ident: ($) => "can_select",
  is_valid_ident: ($) => "is_valid",
  can_revoke_ident: ($) => "can_revoke",
  on_granted_ident: ($) => "on_granted",
  on_revoked_ident: ($) => "on_revoked",
  on_invalid_ident: ($) => "on_invalid",
  on_cooldown_expires_ident: ($) => "on_cooldown_expires",
  penalties_ident: ($) => "penalties",
  benefits_ident: ($) => "benefits",
  modifier_by_land_ownership_ident: ($) => "modifier_by_land_ownership",
  home_province_ident: ($) => "home_province",
  location_ident: ($) => "location",
  potential_ident: ($) => "potential",
  allow_ident: ($) => "allow",
  effect_ident: ($) => "effect",
  provinces_to_highlight_ident: ($) => "provinces_to_highlight",
  slot_ident: ($) => "slot",
  generic_ident: ($) => "generic",
  ai_ident: ($) => "ai",
  has_country_shield_ident: ($) => "has_country_shield",
  icon_ident: ($) => "icon",
  position_ident: ($) => "position",
  add_years_of_owned_provinces_production_income_ident: ($) =>
    "add_years_of_owned_provinces_production_income",
  add_years_of_owned_provinces_manpower_ident: ($) =>
    "add_years_of_owned_provinces_manpower",
  add_years_of_owned_provinces_sailors_ident: ($) =>
    "add_years_of_owned_provinces_sailors",
  required_missions_ident: ($) => "required_missions",
  development_in_provinces_ident: ($) => "development_in_provinces",
  mean_time_to_happen_ident: ($) => "mean_time_to_happen",
  custom_button_ident: ($) => "custom_button",
  custom_window_ident: ($) => "custom_window",
  custom_icon_ident: ($) => "custom_icon",
  custom_text_box_ident: ($) => "custom_text_box",
  custom_tooltip_ident: ($) => "custom_tooltip",
  variable_arithmetic_trigger_ident: ($) => "variable_arithmetic_trigger",
  which_ident: ($) => "which",
  variable_name_ident: ($) => "variable_name",
  export_to_variable_ident: ($) => "export_to_variable",
  effect_variable_combined_ident: ($) =>
    /((set)|(change)|(subtract)|(divide)|(multiply)|(round)|(sqrt)|(random)|(modulo))_variable/,
  trigger_variable_combined_ident: ($) =>
    /(check_variable)|(is_variable_equal)/,
  frame_ident: ($) => "frame",
  number_ident: ($) => "number",
  owner_ident: ($) => "owner",
  every_ident: ($) => "every",
  frame_variable_ident: ($) => "frame_variable",
  ai_chance_ident: ($) => "ai_chance",
  key_ident: ($) => "key",
  power_ident: ($) => "power",
  casus_belli_ident: ($) => "casus_belli",
  war_goal_province_ident: ($) => "war_goal_province",
  declare_war_with_cb_ident: ($) => "declare_war_with_cb",
  add_trade_modifier_ident: ($) => "add_trade_modifier",

  /* Built in language constructs */
  country_effect_conditional_block: ($) =>
    seq(
      field("country_effect", $.if_ident),
      "=",
      "{",
      $.country_limit,
      optional($.country_effects_block),
      "}",
      prec(1, repeat($.country_effect_else_if_block)),
      prec(1, optional($.country_effect_else_block)),
    ),
  country_limit: ($) =>
    seq(
      field("country_trigger", $.limit_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  country_effect_else_if_block: ($) =>
    seq(
      field("country_effect", $.else_if_ident),
      "=",
      "{",
      $.country_limit,
      $.country_effects_block,
      "}",
    ),
  country_effect_else_block: ($) =>
    seq(
      field("country_effect", $.else_ident),
      "=",
      "{",
      $.country_effects_block,
      "}",
    ),

  country_trigger_block: ($) => repeat1($.country_trigger_statement),
  country_trigger_statement: ($) =>
    choice(
      $.country_trigger_statement_simple,
      $.country_trigger_statement_flag,
      prec(1, $.country_trigger_statement_block),
      // NOTE: scripted triggers should? probably be low prio like this
      $.country_trigger_scripted_trigger,
      $.country_trigger_logic,
      $.country_trigger_conditional_block,
      $.country_calc_true_if,
      $.any_hired_mercenary_company, // TODO: special cased
      $.trigger_change_scope,
      $.country_trigger_change_scope,
    ),
  any_hired_mercenary_company: ($) =>
    seq(
      field("country_trigger", "any_hired_mercenary_company"),
      "=",
      "{",
      $.unit_trigger_block,
      "}",
    ),
  country_calc_true_if: ($) =>
    seq(
      field("country_trigger", $.calc_true_if_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.amount_ident), "=", $.number),
          seq(field("argument", $.desc_ident), "=", $.identifier),
          $.country_trigger_statement,
          seq(
            $.exclude_from_progress_ident,
            "=",
            "{",
            $.country_trigger_statement,
            "}",
          ),
        ),
      ),
      "}",
    ),
  country_trigger_statement_flag: ($) =>
    seq(
      field(
        "country_trigger",
        choice(
          "has_global_flag",
          "has_country_flag",
          "has_ruler_flag",
          "has_consort_flag",
          "has_heir_flag",
        ),
      ),
      "=",
      $.identifier,
      optional(field("argument", $.scope_suffix)),
    ),
  country_trigger_conditional_block: ($) =>
    seq(
      field("country_trigger", $.if_ident),
      "=",
      "{",
      $.country_limit,
      optional($.country_trigger_block),
      "}",
      prec(1, repeat($.country_trigger_else_if_block)),
      prec(1, optional($.country_trigger_else_block)),
    ),
  country_trigger_else_if_block: ($) =>
    seq(
      field("country_trigger", $.else_if_ident),
      "=",
      "{",
      $.country_limit,
      $.country_trigger_block,
      "}",
    ),
  country_trigger_else_block: ($) =>
    seq(
      field("country_trigger", $.else_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),

  country_trigger_change_scope: ($) =>
    choice(
      seq(
        field("province_trigger", choice(...COUNTRY_TO_PROVINCE_TRIGGER_SCOPE)),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice($.any_ident, $.all_ident),
          ),
        ),
        $.province_trigger_block,
        "}",
      ),
      seq(
        field("country_trigger", choice(...COUNTRY_TO_COUNTRY_TRIGGER_SCOPE)),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice($.any_ident, $.all_ident),
          ),
        ),
        $.country_trigger_block,
        "}",
      ),
    ),
  trigger_change_scope: ($) =>
    choice(
      seq(
        // NOTE: tree-sitter's context free approach can't know if the generic
        // scopes go to country or province scope .. so we allow both
        choice(...GENERIC_SCOPES),
        "=",
        "{",
        choice($.country_trigger_block, $.province_trigger_block),
        "}",
      ),
      seq(
        field("country_trigger", $.tag),
        "=",
        "{",
        $.country_trigger_block,
        "}",
      ),
      seq(
        field("country_trigger", choice(...COUNTRY_TRIGGER_SCOPE)),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice($.any_ident, $.all_ident),
          ),
        ),
        $.country_trigger_block,
        "}",
      ),
      seq(
        field("province_trigger", choice(...PROVINCE_TRIGGER_SCOPE)),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice($.any_ident, $.all_ident),
          ),
        ),
        $.province_trigger_block,
        "}",
      ),
      seq(
        field("province_trigger", $.province),
        "=",
        "{",
        $.province_trigger_block,
        "}",
      ),
      seq(
        field("province_trigger", choice($.area, $.region, $.province_group)),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice($.any_ident, $.all_ident),
          ),
        ),
        $.province_trigger_block,
        "}",
      ),
      seq(
        field("country_trigger", $.event_target_full_ident),
        "=",
        "{",
        $.country_trigger_block,
        "}",
      ),
      seq(
        field("province_trigger", $.event_target_full_ident),
        "=",
        "{",
        $.province_trigger_block,
        "}",
      ),
    ),
  country_trigger_logic: ($) =>
    seq(
      field("country_trigger", choice(...LOGIC)),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  country_trigger_statement_simple: ($) =>
    choice(
      seq(
        field("country_trigger", choice(...COUNTRY_TRIGGER_STATEMENTS_BOOL)),
        "=",
        $.bool,
      ),
      seq(
        field("country_trigger", choice(...COUNTRY_TRIGGER_STATEMENTS_NUM)),
        "=",
        $.number,
      ),
      seq(
        field("country_trigger", choice(...COUNTRY_TRIGGER_STATEMENTS_IDENT)),
        "=",
        $.identifier,
      ), // TODO: more granular?
      seq(
        field("country_trigger", choice(...COUNTRY_TRIGGER_STATEMENTS_TAG)),
        "=",
        choice(...GENERIC_SCOPES, $.tag, $.event_target_full_ident),
      ),
      seq(
        field("country_trigger", choice(...COUNTRY_TRIGGER_STATEMENTS_PROV)),
        "=",
        choice(...GENERIC_SCOPES, $.province),
      ),
      seq(
        field("country_trigger", choice(...COUNTRY_TRIGGER_STATEMENTS_STR)),
        "=",
        $.string,
      ),
    ),
  country_trigger_scripted_trigger: ($) =>
    seq(
      field("country_trigger", $.identifier),
      "=",
      choice(
        $.bool,
        seq(
          "{",
          repeat1(
            seq(
              field("argument", $.identifier),
              "=",
              choice($.identifier, $.string, $.number),
            ),
          ),
          "}",
        ),
      ),
    ),

  country_trigger_statement_block: ($) =>
    choice(
      $.estate_influence,
      $.country_num_of_provinces_owned,
      $.country_custom_trigger_tooltip,
      $.country_hidden_trigger,
      $.development_in_provinces,
      $.country_variable_arithmetic_trigger,
    ),

  development_in_provinces: ($) =>
    seq(
      field("province_trigger", $.development_in_provinces_ident),
      "=",
      "{",
      seq(field("argument", $.value_ident), "=", $.number),
      $.province_trigger_block,
      "}",
    ),
  country_hidden_trigger: ($) =>
    seq(
      field("country_trigger", $.hidden_trigger_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  country_num_of_provinces_owned: ($) =>
    seq(
      field("province_trigger", $.num_of_provinces_owned_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.value_ident), "=", $.number),
          $.province_trigger_statement,
        ),
      ),
      "}",
    ),
  estate_influence: ($) =>
    seq(
      field("country_trigger", $.estate_influence_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq("estate", "=", $.identifier),
          seq("influence", "=", $.number),
        ),
      ),
      "}",
    ),
  country_custom_trigger_tooltip: ($) =>
    seq(
      field("country_trigger", $.custom_trigger_tooltip_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.tooltip_ident), "=", $.identifier),
          $.country_trigger_statement,
        ),
      ),
      "}",
    ),
  /* Custom gui file */
  custom_gui_file: ($) => repeat1($.custom_gui_statement),
  custom_gui_statement: ($) =>
    choice($.custom_button, $.custom_window, $.custom_icon, $.custom_text_box),
  custom_button: ($) =>
    seq(
      $.custom_button_ident,
      "=",
      "{",
      choice(
        repeat1($.country_custom_button_statement),
        repeat1($.province_custom_button_statement),
      ),
      "}",
    ),
  custom_text_box: ($) =>
    seq(
      $.custom_text_box_ident,
      "=",
      "{",
      repeat1($.custom_text_box_statement),
      "}",
    ),
  custom_icon: ($) =>
    seq($.custom_icon_ident, "=", "{", repeat1($.custom_icon_statement), "}"),
  custom_window: ($) =>
    seq(
      $.custom_window_ident,
      "=",
      "{",
      repeat1($.custom_window_statement),
      "}",
    ),

  province_custom_button_statement: ($) =>
    choice(
      seq(
        field("argument", $.name_ident),
        "=",
        field("namespace", choice($.string, $.identifier)),
      ),
      $.province_potential,
      // $.province_effect,
      $.province_effect_block_statement,
      $.province_option_trigger,
      $.province_frame_trigger,
      seq(
        field("argument", $.tooltip_ident),
        "=",
        choice($.string, $.identifier),
      ),
    ),

  country_custom_button_statement: ($) =>
    choice(
      seq(
        field("argument", $.name_ident),
        "=",
        field("namespace", choice($.string, $.identifier)),
      ),
      $.country_potential,
      // $.province_effect,
      $.decision_effect,
      $.country_option_trigger,
      $.country_frame_trigger,
      seq(
        field("argument", $.tooltip_ident),
        "=",
        choice($.string, $.identifier),
      ),
    ),

  custom_icon_statement: ($) =>
    choice(
      seq(
        field("argument", $.name_ident),
        "=",
        field("namespace", choice($.string, $.identifier)),
      ),
      $.province_potential,
      seq(
        field("argument", $.frame_variable_ident),
        "=",
        choice($.string, $.identifier),
      ),
      $.province_frame_trigger,
      seq(
        field("argument", $.tooltip_ident),
        "=",
        choice($.string, $.identifier),
      ),
    ),
  custom_text_box_statement: ($) =>
    choice(
      seq(
        field("argument", $.name_ident),
        "=",
        field("namespace", choice($.string, $.identifier)),
      ),
      seq(
        field("argument", $.tooltip_ident),
        "=",
        choice($.string, $.identifier),
      ),
      $.province_potential,
    ),
  custom_window_statement: ($) =>
    choice(
      seq(
        field("argument", $.name_ident),
        "=",
        field("namespace", choice($.string, $.identifier)),
      ),
      $.province_potential,
      seq(
        field("argument", $.tooltip_ident),
        "=",
        choice($.string, $.identifier),
      ),
    ),
  province_frame_trigger: ($) =>
    seq(
      field("argument", $.frame_ident),
      "=",
      "{",
      $.number_ident,
      "=",
      $.number,
      $.province_option_trigger,
      "}",
    ),
  country_frame_trigger: ($) =>
    seq(
      field("argument", $.frame_ident),
      "=",
      "{",
      $.number_ident,
      "=",
      $.number,
      $.country_option_trigger,
      "}",
    ),
  /* Modifiers definitions */
  modifiers_file: ($) => repeat1($.modifier_definition),
  modifier_definition: ($) =>
    seq($.identifier, "=", "{", repeat($.modifier), "}"),
  country_modifier_statement: ($) =>
    seq(
      field("argument", $.modifier_ident),
      "=",
      "{",
      repeat1($.country_modifier),
      "}",
    ),
  country_modifier: ($) =>
    choice(
      seq(
        choice(
          field("country_modifier", prec(1, choice(...MODIFIER_GLOBAL_NUM))),
          $.identifier,
        ),
        "=",
        $.number,
      ),
      seq(
        field("country_effect", choice(...MODIFIER_GLOBAL_BOOL)),
        "=",
        $.bool,
      ),
    ),
  modifier: ($) =>
    choice(
      $.country_modifier,
      seq(
        field("province_effect", choice(...MODIFIER_LOCAL_NUM)),
        "=",
        $.number,
      ),
      seq(
        field("province_effect", choice(...MODIFIER_LOCAL_BOOL)),
        "=",
        $.bool,
      ),
      seq(
        field("argument", $.picture_ident),
        "=",
        choice($.string, $.identifier),
      ),
    ),
  /* Missions */
  missions_file: ($) => repeat1($.mission_block),
  mission_block: ($) =>
    seq(
      field("namespace", $.identifier),
      "=",
      "{",
      repeat1($.mission_block_statement),
      "}",
    ),
  mission_block_statement: ($) =>
    choice(
      $.slot,
      $.generic,
      $.ai,
      $.has_country_shield,
      $.country_potential,
      $.mission_definition,
    ),
  slot: ($) => seq(field("argument", $.slot_ident), "=", $.number),
  generic: ($) => seq(field("argument", $.generic_ident), "=", $.bool),
  ai: ($) => seq(field("argument", $.ai_ident), "=", $.bool),
  has_country_shield: ($) =>
    seq(field("argument", $.has_country_shield_ident), "=", $.bool),
  mission_definition: ($) =>
    seq(
      field("namespace", $.identifier),
      "=",
      "{",
      repeat1($.mission_definition_statement),
      "}",
    ),
  mission_definition_statement: ($) =>
    choice(
      $.icon,
      $.position,
      $.required_missions,
      $.provinces_to_highlight,
      $.mission_trigger,
      $.mission_effect,
    ),
  icon: ($) => seq(field("argument", $.icon_ident), "=", $.identifier),
  position: ($) => seq(field("argument", $.position_ident), "=", $.number),
  required_missions: ($) =>
    seq(
      field("argument", $.required_missions_ident),
      "=",
      "{",
      repeat($.identifier),
      "}",
    ),
  mission_trigger: ($) =>
    seq(
      field("country_trigger", $.trigger_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  mission_effect: ($) =>
    seq(
      field("country_effect", $.effect_ident),
      "=",
      "{",
      $.country_effects_block,
      "}",
    ),
  /* Estate privileges */

  estate_privileges_file: ($) => repeat1($.estate_privilege),
  estate_privilege: ($) =>
    seq(
      field("namespace", $.identifier),
      "=",
      "{",
      repeat1(
        choice(
          $.icon,
          $.land_share,
          $.max_absolutism,
          $.influence,
          $.loyalty,
          $.cooldown_years,
          $.ai_will_do,
          $.conditional_modifier,
          $.priv_mechanics,
          $.priv_triggers,
          $.priv_effects,
          $.priv_province_effects,
          $.priv_modifiers,
        ),
      ),
      "}",
    ),
  conditional_modifier: ($) =>
    seq(
      field(
        "argument",
        choice(
          $.conditional_modifier_ident,
          $.influence_scaled_conditional_modifier_ident,
        ),
      ),
      "=",
      "{",
      repeat(
        choice(
          $.country_option_trigger /* trigger = { <triggers> } */,
          seq(
            field("country_modifier", $.modifier_ident),
            "=",
            "{",
            repeat($.country_modifier),
            "}",
          ),
          seq(field("argument", $.is_bad_ident), "=", $.bool),
        ),
      ),
      "}",
    ),
  land_share: ($) => seq(field("argument", $.land_share_ident), "=", $.number),
  influence: ($) => seq(field("argument", $.influence_ident), "=", $.number),
  loyalty: ($) => seq(field("argument", $.loyalty_ident), "=", $.number),
  cooldown_years: ($) =>
    seq(field("argument", $.cooldown_years_ident), "=", $.number),

  priv_mechanics: ($) =>
    seq(
      field("argument", $.mechanics_ident),
      "=",
      "{",
      repeat($.identifier),
      "}",
    ),
  priv_triggers: (
    $ /* priv specific trigger blocks: can_select, is_valid, can_revoke  */,
  ) =>
    seq(
      field(
        "country_trigger",
        choice($.can_select_ident, $.is_valid_ident, $.can_revoke_ident),
      ),
      "=",
      "{",
      optional($.country_trigger_block),
      "}",
    ),

  priv_effects: (
    $ /* priv specific effects blocks: on_granted, on_revoked, on_invalid, on_cooldown_expires */,
  ) =>
    seq(
      field(
        "country_effect",
        choice(
          $.on_granted_ident,
          $.on_revoked_ident,
          $.on_invalid_ident,
          $.on_cooldown_expires_ident,
        ),
      ),
      "=",
      "{",
      optional($.country_effects_block),
      "}",
    ),

  priv_province_effects: ($) =>
    seq(
      field(
        "province_effect",
        choice(
          $.on_granted_province_ident,
          $.on_revoked_province_ident,
          $.on_invalid_province_ident,
        ),
      ),
      "=",
      "{",
      repeat($.province_effect),
      "}",
    ),
  priv_modifiers: (
    $ /* priv specific modifiers blocks: penalties, benefits, modifier_by_land_ownership */,
  ) =>
    seq(
      field(
        "country_modifier",
        choice(
          $.penalties_ident,
          $.benefits_ident,
          $.modifier_by_land_ownership_ident,
        ),
      ),
      "=",
      "{",
      repeat($.country_modifier),
      "}",
    ),
  max_absolutism: ($) =>
    seq(field("argument", $.max_absolutism_ident), "=", $.number),
  /* Church aspects */
  church_aspects_file: ($) => repeat1($.church_aspect),
  church_aspect: ($) =>
    seq(
      field("namespace", $.identifier),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.cost_ident), "=", $.number),
          seq(field("argument", $.sprite_ident), "=", $.string),
        ),
      ),
      repeat1(
        choice(
          $.country_potential,
          $.ai_will_do,
          $.decision_effect,
          $.country_option_trigger,
          $.country_modifier_statement,
        ),
      ),
      "}",
    ),
  /* Decisions */
  decisions_file: ($) =>
    seq("country_decisions", "=", "{", repeat1($.decision), "}"),
  decision: ($) =>
    seq(
      field("namespace", $.identifier),
      "=",
      "{",
      repeat1(
        choice(
          $.major,
          $.color,
          $.provinces_to_highlight,
          $.country_potential,
          $.decision_allow,
          $.decision_effect,
          $.ai_will_do,
          $.ai_importance,
        ),
      ),
      "}",
    ),

  color: ($) =>
    seq(
      field("argument", $.color_ident),
      "=",
      "{",
      $.byte,
      $.byte,
      $.byte,
      "}",
    ),

  ai_will_do: ($) =>
    seq(
      $.ai_will_do_ident,
      "=",
      "{",
      seq(field("argument", $.factor_ident), "=", $.number),
      repeat(
        seq(
          field("country_trigger", $.modifier_ident),
          "=",
          "{",
          $.country_modifier_block,
          "}",
        ),
      ),
      "}",
    ),
  ai_importance: ($) =>
    seq(field("argument", $.ai_importance_ident), "=", $.number),
  province_potential: ($) =>
    seq(
      field("province_trigger", $.potential_ident),
      "=",
      "{",
      optional($.province_trigger_block),
      "}",
    ),
  country_potential: ($) =>
    seq(
      field("country_trigger", $.potential_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  provinces_to_highlight: ($) =>
    seq(
      field("province_trigger", $.provinces_to_highlight_ident),
      "=",
      "{",
      optional($.province_trigger_block),
      "}",
    ),
  decision_allow: ($) =>
    seq(
      field("country_trigger", $.allow_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  decision_effect: ($) =>
    seq(
      field("country_effect", $.effect_ident),
      "=",
      "{",
      $.country_effects_block,
      "}",
    ),
  /* Events */
  events_file: ($) =>
    seq(
      optional($.namespace),
      repeat1(choice($.province_event, $.country_event)),
    ),
  namespace: ($) => seq("namespace", "=", field("namespace", $.identifier)),

  // event metadata
  event_id: ($) =>
    seq(
      field("argument", $.id_ident),
      "=",
      field("namespace", choice($.string, $.identifier, $.number)),
    ),
  event_title: ($) =>
    seq(field("argument", $.title_ident), "=", choice($.string, $.identifier)),
  country_event_desc: ($) =>
    seq(
      field("argument", $.desc_ident),
      "=",
      choice(
        $.string,
        $.identifier,
        seq(
          "{",
          repeat1(
            choice(
              $.country_option_trigger,
              seq(
                field("argument", $.desc_ident),
                "=",
                choice($.string, $.identifier),
              ),
            ),
          ),
          "}",
        ),
      ),
    ),
  province_event_desc: ($) =>
    seq(
      field("argument", $.desc_ident),
      "=",
      choice(
        $.string,
        $.identifier,
        seq(
          "{",
          repeat1(
            choice(
              $.province_option_trigger,
              seq(
                field("argument", $.desc_ident),
                "=",
                choice($.string, $.identifier),
              ),
            ),
          ),
          "}",
        ),
      ),
    ),
  country_event_picture: ($) =>
    seq(
      field("argument", $.picture_ident),
      "=",

      choice(
        $.string,
        $.identifier,
        seq(
          "{",
          repeat1(
            choice(
              $.country_option_trigger,
              seq(
                field("argument", $.picture_ident),
                "=",
                choice($.string, $.identifier),
              ),
            ),
          ),
          "}",
        ),
      ),
    ),
  province_event_picture: ($) =>
    seq(
      field("argument", $.picture_ident),
      "=",

      choice($.string, $.identifier, seq("{", $.province_option_trigger, "}")),
    ),
  is_triggered_only: ($) => seq("is_triggered_only", "=", $.bool),
  fire_only_once: ($) => seq("fire_only_once", "=", $.bool),
  country_ai_chance: ($) =>
    seq(
      field("country_trigger", $.ai_chance_ident),
      "=",
      "{",
      seq(field("argument", $.factor_ident), "=", $.number),
      repeat($.country_modifier_trigger),
      "}",
    ),
  country_modifier_trigger: ($) =>
    seq(
      field("country_trigger", $.modifier_ident),
      "=",
      "{",
      seq(field("argument", $.factor_ident), "=", $.number),
      $.country_trigger_block,
      "}",
    ),
  province_ai_chance: ($) =>
    seq(
      field("province_trigger", $.ai_chance_ident),
      "=",
      "{",
      seq(field("argument", $.factor_ident), "=", $.number),
      repeat($.province_modifier_trigger),
      "}",
    ),
  province_modifier_trigger: ($) =>
    seq(
      field("province_trigger", $.modifier_ident),
      "=",
      "{",
      seq(field("argument", $.factor_ident), "=", $.number),
      $.province_trigger_block,
      "}",
    ),
  hidden: ($) => seq("hidden", "=", $.bool),
  goto: ($) => seq("goto", "=", choice($.number, $.identifier, $.event_target)),
  major: ($) => seq("major", "=", $.bool),
  major_trigger: ($) =>
    seq(
      field("country_trigger", $.major_trigger_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  // option metadata
  option_name: ($) =>
    seq(
      field("argument", $.name_ident),
      "=",
      field("namespace", choice($.string, $.identifier)),
    ),
  option_highlight: ($) => seq("highlight", "=", $.bool),
  country_option_trigger: ($) =>
    seq(
      field("country_trigger", $.trigger_ident),
      "=",
      "{",
      $.country_trigger_block,
      "}",
    ),
  province_option_trigger: ($) =>
    seq(
      field("province_trigger", $.trigger_ident),
      "=",
      "{",
      optional($.province_trigger_block),
      "}",
    ),

  // Country event
  country_event: ($) =>
    seq(
      field("block", $.country_event_ident),
      "=",
      "{",
      repeat1($.country_event_statement),
      "}",
    ),
  province_event: ($) =>
    seq("province_event", "=", "{", repeat1($.province_event_statement), "}"),
  province_event_statement: ($) =>
    choice(
      $.event_id,
      $.event_title,
      $.province_event_desc,
      $.province_event_picture,
      $.is_triggered_only,
      $.fire_only_once,
      $.hidden,
      $.major,
      $.major_trigger,
      $.goto,
      $.province_event_mtth,
      $.province_event_trigger,
      $.province_event_immediate,
      $.province_event_after,
      $.province_event_option,
    ),
  country_event_statement: ($) =>
    choice(
      $.event_id,
      $.event_title,
      $.country_event_desc,
      $.country_event_picture,
      $.is_triggered_only,
      $.fire_only_once,
      $.hidden,
      $.major,
      $.major_trigger,
      $.goto,
      $.country_event_mtth,
      $.country_event_trigger,
      $.country_event_immediate,
      $.country_event_after,
      $.country_event_option,
    ),

  country_event_mtth: ($) =>
    seq(
      field("argument", $.mean_time_to_happen_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq("months", "=", $.number),
          seq("days", "=", $.number),
          seq("years", "=", $.number),
          seq(
            field("argument", $.modifier_ident),
            "=",
            "{",
            $.country_modifier_block,
            "}",
          ),
        ),
      ),
      "}",
    ),
  province_event_mtth: ($) =>
    seq(
      "mean_time_to_happen",
      "=",
      "{",
      repeat1(choice(seq("months", "=", $.number), seq("days", "=", $.number))),
      "}",
    ),
  country_event_trigger: ($) =>
    seq(
      field("country_trigger", $.trigger_ident),
      "=",
      "{",
      optional($.country_trigger_block),
      "}",
    ),
  province_event_trigger: ($) =>
    seq(
      field("province_trigger", $.trigger_ident),
      "=",
      "{",
      optional($.province_trigger_block),
      "}",
    ),
  country_event_immediate: ($) =>
    prec(
      2,
      seq(
        field("country_effect", $.immediate_ident),
        "=",
        "{",
        optional($.country_effects_block),
        "}",
      ),
    ),
  province_event_immediate: ($) =>
    prec(
      2,
      seq(
        field("province_effect", $.immediate_ident),
        "=",
        "{",
        optional($.province_effects_block),
        "}",
      ),
    ),
  country_event_after: ($) =>
    seq(
      field("country_effect", $.after_ident),
      "=",
      "{",
      optional($.country_effects_block),
      "}",
    ),
  province_event_after: ($) =>
    seq(
      field("province_effect", $.after_ident),
      "=",
      "{",
      optional($.province_effects_block),
      "}",
    ),
  country_event_option: ($) =>
    seq(
      field("country_effect", $.option_ident),
      "=",
      "{",
      $.country_event_option_block,
      "}",
    ),
  province_event_option: ($) =>
    seq(
      field("province_effect", $.option_ident),
      "=",
      "{",
      $.province_event_option_block,
      "}",
    ),
  /* Country Scope Effects */
  country_effects_block: ($) => repeat1($.country_effect),
  country_event_option_block: ($) => repeat1($.country_event_option_statement),
  country_event_option_statement: ($) =>
    choice(
      $.option_name,
      $.country_ai_chance,
      $.goto,
      $.country_effect,
      $.country_option_trigger,
      $.option_highlight,
    ),
  country_effect: ($) =>
    // TODO: this should include all possible effects later
    choice(
      $.country_effect_statement_simple,
      $.country_effect_statement_flag,
      $.country_effect_statement_block,
      $.country_effect_conditional_block,
      $.country_effect_trigger_switch,
      prec(1, $.effect_change_scope),
      prec(1, $.country_effect_change_scope),
      $.random_hired_mercenary_company, // special cased for now. TODO: turn into generic COUNTRY_TO_UNIT_CHANGE_SCOPE?
      // $.country_effect_scripted_effect_precompiled,
      prec.dynamic(-5, $.country_effect_scripted_effect),
    ),

  random_hired_mercenary_company: ($) =>
    seq(
      field("country_effect", "random_hired_mercenary_company"),
      "=",
      "{",
      optional(
        seq(
          field("unit_trigger", $.limit_ident),
          "=",
          "{",
          $.unit_trigger_block,
          "}",
        ),
      ),
      $.unit_effect_block,
      "}",
    ),
  unit_trigger_block: ($) => repeat1($.unit_trigger_statement),
  unit_effect_block: ($) => repeat1($.unit_effect_statement),
  unit_trigger_statement: ($) =>
    choice(
      seq(
        field("unit_trigger", choice(...UNIT_TRIGGER_STATEMENTS_STR)),
        "=",
        choice($.string, $.identifier),
      ),
      seq(
        field("unit_trigger", choice(...UNIT_TRIGGER_STATEMENTS_BOOL)),
        "=",
        $.bool,
      ),
      seq(
        field("unit_trigger", choice(...UNIT_TRIGGER_STATEMENTS_NUM)),
        "=",
        $.number,
      ),
      // NOTE: special scope changes
      seq(
        field(
          "province_trigger",
          choice($.home_province_ident, $.location_ident),
        ),
        "=",
        "{",
        $.province_trigger_block,
        "}",
      ),
    ),
  unit_effect_statement: ($) =>
    choice(
      // NOTE: special scope changes
      seq(
        field(
          "province_effect",
          choice($.home_province_ident, $.location_ident),
        ),
        "=",
        "{",
        $.province_effects_block,
        "}",
      ),
    ),
  country_effect_trigger_switch: ($) =>
    seq(
      field("country_trigger", $.trigger_switch_ident),
      "=",
      "{",
      seq(
        field("argument", $.on_trigger_ident),
        "=",
        choice(
          field(
            "country_trigger",
            choice(
              "has_global_flag",
              "has_country_flag",
              "has_ruler_flag",
              "has_consort_flag",
              "has_heir_flag",
              "mercenary_company",
              ...COUNTRY_TRIGGER_STATEMENTS_BOOL,
              ...COUNTRY_TRIGGER_STATEMENTS_NUM,
              ...COUNTRY_TRIGGER_STATEMENTS_IDENT,
              ...COUNTRY_TRIGGER_STATEMENTS_TAG, // TODO: is this supported?
              ...COUNTRY_TRIGGER_STATEMENTS_PROV,
            ),
          ),
        ),
      ),
      repeat(
        seq(
          field("namespace", $.identifier),
          "=",
          "{",
          $.country_effects_block,
          "}",
        ),
      ),
      "}",
    ),
  country_effect_statement_flag: ($) =>
    seq(
      field(
        "country_effect",
        choice(
          "set_global_flag",
          "set_country_flag",
          "set_ruler_flag",
          "set_consort_flag",
          "set_heir_flag",
          "clr_global_flag",
          "clr_country_flag",
          "clr_ruler_flag",
          "clr_consort_flag",
          "clr_heir_flag",
        ),
      ),
      "=",
      $.identifier,
      optional(field("argument", $.scope_suffix)),
    ),
  event_target: ($) =>
    token(seq("event_target:", token.immediate(/[a-zA-Z0-9][a-zA-Z0-9\.\_]*/))),
  scope_suffix: ($) =>
    seq(
      token.immediate("@"),
      token.immediate(
        choice(
          ...GENERIC_SCOPES,
          ...SPECIAL_FLAG_SCOPES,
          seq("event_target:", token.immediate(/[a-zA-Z0-9][a-zA-Z0-9\.\_]*/)),
        ),
      ),
    ),
  country_effect_scripted_effect: ($) =>
    seq(
      field("country_effect", $.identifier),
      "=",
      choice(
        $.bool,
        seq(
          "{",
          repeat1(
            seq(
              field("argument", $.identifier),
              "=",
              choice($.identifier, $.string, $.operator, $.number, $.bool),
            ),
          ),
          "}",
        ),
      ),
    ),
  unit_effect_scripted_effect: ($) =>
    seq(
      $.identifier,
      "=",
      choice(
        $.bool,
        seq(
          "{",
          repeat1(
            seq(
              field("argument", $.identifier),
              "=",
              choice($.identifier, $.string, $.number, $.bool),
            ),
          ),
          "}",
        ),
      ),
    ),

  effect_change_scope: ($) =>
    choice(
      seq(
        // NOTE: tree-sitter's context free approach can't know if the generic
        // scopes go to country or province scope .. so we allow both
        choice(...GENERIC_SCOPES),
        "=",
        "{",
        choice($.country_effects_block, $.province_effects_block),
        "}",
      ),
      seq(
        field("country_effect", $.tag),
        "=",
        "{",
        $.country_effects_block,
        "}",
      ),
      seq(
        field("province_effect", $.province),
        "=",
        "{",
        $.province_effects_block,
        "}",
      ),
      seq(
        field("province_effect", choice($.area, $.region, $.province_group)),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice(
              $.all_ident,
              seq(
                $.random_ident,
                field("argument", $.amount_ident),
                "=",
                $.number,
              ),
            ),
          ),
        ),
        optional($.province_limit),
        $.province_effects_block,
        "}",
      ),
      seq(
        field("province_effect", choice(...PROVINCE_EFFECT_SCOPE)),
        "=",
        "{",
        optional($.province_limit),
        $.province_effects_block,
        "}",
      ),
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_SCOPE)),
        "=",
        "{",
        optional($.country_limit),
        $.country_effects_block,
        "}",
      ),
      choice(
        seq(
          field("country_effect", $.event_target_full_ident),
          "=",
          "{",
          $.country_effects_block,
          "}",
        ),
        seq(
          field("province_effect", $.event_target_full_ident),
          "=",
          "{",
          $.province_effects_block,
          "}",
        ),
      ),
    ),

  country_effect_change_scope: ($) =>
    choice(
      seq(
        field("province_effect", choice(...COUNTRY_TO_PROVINCE_EFFECT_SCOPE)),
        "=",
        "{",
        optional($.province_limit),
        $.province_effects_block,
        "}",
      ),
      seq(
        field("country_effect", choice(...COUNTRY_TO_COUNTRY_EFFECT_SCOPE)),
        "=",
        "{",
        optional($.country_limit),
        $.country_effects_block,
        "}",
      ),
    ),

  country_effect_statement_simple: ($) =>
    // example: add_prestige = 10
    choice(
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_STATEMENTS_NUM)),
        "=",
        $.number,
      ),
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_STATEMENTS_STR)),
        "=",
        $.string,
      ),
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_STATEMENTS_PROV)),
        "=",
        choice(...GENERIC_SCOPES, $.province),
      ),
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_STATEMENTS_TAG)),
        "=",
        choice(...GENERIC_SCOPES, $.tag, $.event_target_full_ident),
      ),
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_STATEMENTS_VARIABLE)),
        "=",
        $.variable_full_ident,
      ),
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_STATEMENTS_BOOL)),
        "=",
        $.bool,
      ),
      seq("kill_heir", "=", "{}"), // NOTE: special case special syntax
      seq(
        field("country_effect", choice(...COUNTRY_EFFECT_STATEMENTS_IDENT)),
        "=",
        $.identifier,
      ), // TODO more granular?
    ),
  country_effect_statement_block: ($) =>
    choice(
      $.add_country_modifier,
      $.country_hidden_effect,
      $.country_event_effect,
      $.country_tooltip,
      $.add_opinion,
      $.change_country_color,
      $.country_random,
      $.country_random_list,
      $.country_export_to_variable,
      $.country_math_variable,
      $.declare_war_with_cb,
      $.add_years_of_owned_provinces,
    ),

  add_years_of_owned_provinces: ($) =>
    seq(
      field(
        "country_effect",
        choice(
          $.add_years_of_owned_provinces_production_income_ident,
          $.add_years_of_owned_provinces_manpower_ident,
          $.add_years_of_owned_provinces_sailors_ident,
        ),
      ),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.years_ident), "=", $.number),
          seq(
            field("country_effect", $.custom_tooltip_ident),
            "=",
            $.identifier,
          ),
          $.province_option_trigger,
        ),
      ),
      "}",
    ),
  declare_war_with_cb: ($) =>
    seq(
      field("country_effect", $.declare_war_with_cb_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(
            field("argument", $.who_ident),
            "=",
            choice(
              $.tag,
              ...GENERIC_SCOPES,
              $.identifier,
              $.event_target_full_ident,
            ),
          ),
          seq(field("argument", $.casus_belli_ident), "=", $.identifier),
          seq(field("argument", $.war_goal_province_ident), "=", $.province),
        ),
      ),
      "}",
    ),

  country_tooltip: ($) =>
    seq(
      field("country_effect", $.tooltip_ident),
      "=",
      "{",
      $.country_effects_block,
      "}",
    ),
  country_random: ($) =>
    seq(
      field("country_effect", $.random_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.chance_ident), "=", $.number),
          $.country_effect,
        ),
      ),
      "}",
    ),
  country_modifier_block: ($) =>
    repeat1(
      choice(
        seq(field("argument", $.factor_ident), "=", $.number),
        $.country_trigger_statement,
      ),
    ),
  province_modifier_block: ($) =>
    repeat1(
      choice(
        seq(field("argument", $.factor_ident), "=", $.number),
        $.province_trigger_statement,
      ),
    ),
  country_random_list: ($) =>
    seq(
      field("country_effect", $.random_list_ident),
      "=",
      "{",
      repeat1(
        seq(
          field("argument", $.number),
          "=",
          "{",
          repeat(
            choice(
              seq(
                field("argument", $.modifier_ident),
                "=",
                "{",
                $.country_modifier_block,
                "}",
              ),
              seq(
                field("country_trigger", $.trigger_ident),
                "=",
                "{",
                $.country_trigger_block,
                "}",
              ),
              $.country_effect,
            ),
          ),
          "}",
        ),
      ),
      "}",
    ),
  add_opinion: ($) =>
    seq(
      field("country_effect", $.add_opinion_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(
            field("argument", $.who_ident),
            "=",
            choice($.tag, ...GENERIC_SCOPES, $.identifier),
          ),
          seq(field("argument", $.modifier_ident), "=", $.identifier),
          seq(field("argument", $.multiplier_ident), "=", $.identifier),
          seq(field("argument", $.years_ident), "=", $.number),
        ),
      ),
      "}",
    ),
  add_trade_modifier: ($) =>
    seq(
      field("province_effect", $.add_trade_modifier_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(
            field("argument", $.who_ident),
            "=",
            choice(
              $.tag,
              ...GENERIC_SCOPES,
              $.identifier,
              $.event_target_full_ident,
            ),
          ),
          seq(field("argument", $.duration_ident), "=", $.number),
          seq(field("argument", $.power_ident), "=", $.number),
          seq(field("argument", $.key_ident), "=", $.identifier),
        ),
      ),
      "}",
    ),
  country_event_effect: ($) =>
    seq(
      field("country_effect", $.country_event_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(
            field("argument", $.id_ident),
            "=",
            choice($.identifier, $.number, $.string),
          ),
          seq(field("argument", $.days_ident), "=", $.number),
          seq(field("argument", $.random_ident), "=", $.number),
          seq(
            field("argument", $.tooltip_ident),
            "=",
            choice($.string, $.identifier),
          ),
        ),
      ),
      "}",
    ),
  /* country scoped effects that need new blocks */
  country_hidden_effect: ($) =>
    seq(
      field("country_effect", $.hidden_effect_ident),
      "=",
      "{",
      $.country_effects_block,
      "}",
    ),
  add_country_modifier: ($) =>
    seq(
      field("country_effect", $.add_country_modifier_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(
            field("argument", $.name_ident),
            "=",
            choice($.identifier, $.string),
          ),
          seq(field("argument", $.duration_ident), "=", $.number),
          seq(field("argument", $.hidden_ident), "=", $.bool),
          seq(
            field("argument", $.desc_ident),
            "=",
            choice($.identifier, $.string),
          ),
        ),
      ),
      "}",
    ),
  change_country_color: ($) =>
    seq(
      field("country_effect", $.change_country_color_ident),
      "=",
      "{",
      choice(
        seq(
          field("argument", $.color_ident),
          "=",
          "{",
          $.byte,
          $.byte,
          $.byte,
          "}",
        ),
        seq(
          field("argument", $.country_ident),
          "=",
          choice($.tag, ...GENERIC_SCOPES),
        ),
      ),
      "}",
    ),

  /* Province Scope Effects */
  province_effects_block: ($) => repeat1($.province_effect),
  province_event_option_block: ($) =>
    repeat1($.province_event_option_statement),
  province_event_option_statement: ($) =>
    choice(
      $.option_name,
      $.province_ai_chance,
      $.goto,
      $.province_effect,
      $.province_option_trigger,
      $.option_highlight,
    ),
  province_effect: ($) =>
    // TODO: this should include all possible effects later
    choice(
      $.province_effect_statement_simple,
      $.province_effect_statement_flag,
      $.province_effect_trigger_switch,
      $.province_effect_statement_block,
      $.province_effect_conditional_block,
      prec(-5, $.province_effect_scripted_effect),
      prec(1, $.effect_change_scope),
      prec(1, $.province_effect_change_scope),
    ),

  province_effect_scripted_effect: ($) =>
    seq(
      field("province_effect", $.identifier),
      "=",
      choice(
        $.bool,
        seq(
          "{",
          repeat1(
            seq(
              field("argument", $.identifier),
              "=",
              choice($.identifier, $.string, $.operator, $.number, $.bool),
            ),
          ),
          "}",
        ),
      ),
    ),

  province_effect_trigger_switch: ($) =>
    seq(
      field("province_trigger", $.trigger_switch_ident),
      "=",
      "{",
      seq(
        field("argument", $.on_trigger_ident),
        "=",
        choice(
          field(
            "province_trigger",
            choice(
              "has_global_flag",
              "has_province_flag",
              ...PROVINCE_TRIGGER_STATEMENTS_BOOL,
              ...PROVINCE_TRIGGER_STATEMENTS_NUM,
              ...PROVINCE_TRIGGER_STATEMENTS_IDENT,
              ...PROVINCE_TRIGGER_STATEMENTS_TAG, // TODO: is this supported?
              ...PROVINCE_TRIGGER_STATEMENTS_PROV,
            ),
          ),
        ),
      ),
      repeat(seq($.identifier, "=", "{", $.province_effects_block, "}")),
      "}",
    ),
  province_effect_statement_flag: ($) =>
    seq(
      field(
        "province_effect",
        choice(
          "set_global_flag",
          "set_province_flag",
          "clr_global_flag",
          "clr_province_flag",
        ),
      ),
      "=",
      $.identifier,
      optional(field("argument", $.scope_suffix)),
    ),
  province_effect_change_scope: ($) =>
    choice(
      seq(
        field("province_effect", choice(...PROVINCE_TO_PROVINCE_EFFECT_SCOPE)),
        "=",
        "{",
        optional($.province_limit),
        $.province_effects_block,
        "}",
      ),
      seq(
        field("country_effect", choice(...PROVINCE_TO_COUNTRY_EFFECT_SCOPE)),
        "=",
        "{",
        optional($.country_limit),
        $.country_effects_block,
        "}",
      ),
      seq(
        field("province_effect", choice(...PROVINCE_TO_PROVINCE_EFFECT_SCOPE)),
        "=",
        "{",
        optional($.province_limit),
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice(
              $.every_ident,
              seq(
                $.random_ident,
                field("argument", $.amount_ident),
                "=",
                $.number,
              ),
            ),
          ),
        ),

        $.province_effects_block,
        "}",
      ),
    ),

  province_effect_statement_simple: ($) =>
    // example: add_prestige = 10
    choice(
      seq(
        field("province_effect", choice(...PROVINCE_EFFECT_STATEMENTS_NUM)),
        "=",
        $.number,
      ),
      seq(
        field("province_effect", choice(...PROVINCE_EFFECT_STATEMENTS_BOOL)),
        "=",
        $.bool,
      ),
      seq(
        field("province_effect", choice(...PROVINCE_EFFECT_STATEMENTS_STR)),
        "=",
        $.string,
      ),
      seq(
        field("province_effect", choice(...PROVINCE_EFFECT_STATEMENTS_PROV)),
        "=",
        choice(...GENERIC_SCOPES, $.province),
      ),
      seq(
        field(
          "province_effect",
          choice(...PROVINCE_EFFECT_STATEMENTS_VARIABLE),
        ),
        "=",
        $.variable_full_ident,
      ),
      seq(
        field("province_effect", choice(...PROVINCE_EFFECT_STATEMENTS_IDENT)),
        "=",
        $.identifier,
      ), // TODO more granular?
      seq(
        field("province_effect", choice(...PROVINCE_EFFECT_STATEMENTS_TAG)),
        "=",
        choice($.tag, ...GENERIC_SCOPES, $.event_target_full_ident),
      ),
    ),
  province_effect_statement_block: ($) =>
    choice(
      $.add_province_modifier,
      $.add_trade_modifier,
      $.province_event_effect,
      $.province_hidden_effect,
      $.province_tooltip,
      $.kill_units,
      $.province_random,
      $.province_random_list,
      $.province_export_to_variable,
      $.province_math_variable,
    ),

  province_random_list: ($) =>
    seq(
      field("province_effect", $.random_list_ident),
      "=",
      "{",
      repeat1(
        seq(
          field("argument", $.number),
          "=",
          "{",
          repeat(
            choice(
              seq(
                field("argument", $.modifier_ident),
                "=",
                "{",
                $.province_modifier_block,
                "}",
              ),
              seq(
                field("province_trigger", $.trigger_ident),
                "=",
                "{",
                $.province_trigger_block,
                "}",
              ),
              $.province_effect,
            ),
          ),
          "}",
        ),
      ),
      "}",
    ),
  province_random: ($) =>
    seq(
      field("province_effect", $.random_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.chance_ident), "=", $.number),
          $.province_effect,
        ),
      ),
      "}",
    ),

  province_tooltip: ($) =>
    seq(
      field("province_effect", $.tooltip_ident),
      "=",
      "{",
      $.province_effects_block,
      "}",
    ),
  kill_units: ($) =>
    seq(
      field("province_effect", $.kill_units_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.who_ident), "=", $.identifier),
          seq(field("argument", $.type_ident), "=", $.identifier),
          seq(field("argument", $.amount_ident), "=", $.number),
        ),
      ),
      "}",
    ),

  province_effect_block_statement: ($) =>
    seq(
      field("province_effect", $.effect_ident),
      "=",
      "{",
      optional($.province_effects_block),
      "}",
    ),
  province_hidden_effect: ($) =>
    seq(
      field("province_effect", $.hidden_effect_ident),
      "=",
      "{",
      $.province_effects_block,
      "}",
    ),
  add_province_modifier: ($) =>
    seq(
      field("province_effect", $.add_province_modifier_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(
            field("argument", $.name_ident),
            "=",
            choice($.identifier, $.string),
          ),
          seq(field("argument", $.duration_ident), "=", $.number),
          seq(field("argument", $.hidden_ident), "=", $.bool),
          seq(field("argument", $.desc_ident), "=", $.identifier),
        ),
      ),
      "}",
    ),
  province_event_effect: ($) =>
    seq(
      field("province_effect", $.province_event_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(
            field("argument", $.id_ident),
            "=",
            choice($.identifier, $.number, $.string),
          ),
          seq(field("argument", $.days_ident), "=", $.number),
          seq(field("argument", $.random_ident), "=", $.number),
          seq(
            field("argument", $.tooltip_ident),
            "=",
            choice($.string, $.identifier),
          ),
        ),
      ),
      "}",
    ),
  /* province triggers */
  province_effect_conditional_block: ($) =>
    seq(
      field("province_effect", $.if_ident),
      "=",
      "{",
      $.province_limit,
      optional($.province_effects_block),
      "}",
      prec(1, repeat($.province_else_if_block)),
      prec(1, optional($.province_else_block)),
    ),
  province_limit: ($) =>
    seq(
      field("province_trigger", $.limit_ident),
      "=",
      "{",
      $.province_trigger_block,
      "}",
    ),
  province_else_if_block: ($) =>
    seq(
      field("province_effect", $.else_if_ident),
      "=",
      "{",
      $.province_limit,
      $.province_effects_block,
      "}",
    ),
  province_else_block: ($) =>
    seq(
      field("province_effect", $.else_ident),
      "=",
      "{",
      $.province_effects_block,
      "}",
    ),

  province_trigger_block: ($) => repeat1($.province_trigger_statement),
  province_trigger_statement: ($) =>
    choice(
      $.province_trigger_statement_simple,
      $.province_trigger_statement_flag,
      $.province_trigger_statement_block,
      $.province_trigger_logic,
      $.province_trigger_conditional_block,
      $.province_trigger_scripted_trigger,
      $.province_calc_true_if,
      $.trigger_change_scope,
      $.province_trigger_change_scope,
    ),

  province_calc_true_if: ($) =>
    seq(
      field("province_trigger", $.calc_true_if_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.amount_ident), "=", $.number),
          seq(field("argument", $.desc_ident), "=", $.identifier),
          $.province_trigger_statement,
          seq(
            $.exclude_from_progress_ident,
            "=",
            "{",
            $.province_trigger_statement,
            "}",
          ),
        ),
      ),
      "}",
    ),
  province_trigger_scripted_trigger: ($) =>
    seq(
      field("province_trigger", $.identifier),
      "=",
      choice(
        $.bool,
        seq(
          "{",
          repeat1(
            seq(
              field("argument", $.identifier),
              "=",
              choice($.identifier, $.string, $.number),
            ),
          ),
          "}",
        ),
      ),
    ),

  province_trigger_statement_flag: ($) =>
    seq(
      field("province_trigger", choice("has_global_flag", "has_province_flag")),
      "=",
      $.identifier,
      optional(field("argument", $.scope_suffix)),
    ),
  province_trigger_conditional_block: ($) =>
    seq(
      field("province_trigger", $.if_ident),
      "=",
      "{",
      $.province_limit,
      optional($.province_trigger_block),
      "}",
      prec(1, repeat($.province_trigger_else_if_block)),
      prec(1, optional($.province_trigger_else_block)),
    ),
  province_trigger_else_if_block: ($) =>
    seq(
      field("province_trigger", $.else_if_ident),
      "=",
      "{",
      $.province_limit,
      $.province_trigger_block,
      "}",
    ),
  province_trigger_else_block: ($) =>
    seq(
      field("province_trigger", $.else_ident),
      "=",
      "{",
      $.province_trigger_block,
      "}",
    ),

  province_trigger_change_scope: ($) =>
    choice(
      seq(
        field("country_trigger", choice(...PROVINCE_TO_COUNTRY_TRIGGER_SCOPE)),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice($.any_ident, $.all_ident),
          ),
        ),
        $.country_trigger_block,
        "}",
      ),
      seq(
        field(
          "province_trigger",
          choice(...PROVINCE_TO_PROVINCE_TRIGGER_SCOPE),
        ),
        "=",
        "{",
        optional(
          seq(
            field("argument", $.type_ident),
            "=",
            choice($.any_ident, $.all_ident),
          ),
        ),
        $.province_trigger_block,
        "}",
      ),
    ),
  province_trigger_logic: ($) =>
    seq(
      field("province_trigger", choice(...LOGIC)),
      "=",
      "{",
      $.province_trigger_block,
      "}",
    ),
  province_trigger_statement_simple: ($) =>
    choice(
      seq(
        field("province_trigger", choice(...PROVINCE_TRIGGER_STATEMENTS_BOOL)),
        "=",
        $.bool,
      ),
      seq(
        field("province_trigger", choice(...PROVINCE_TRIGGER_STATEMENTS_STR)),
        "=",
        $.string,
      ),
      seq(
        field("province_trigger", choice(...PROVINCE_TRIGGER_STATEMENTS_PROV)),
        "=",
        choice($.province, ...GENERIC_SCOPES, $.event_target_full_ident),
      ),
      seq(
        field("province_trigger", choice(...PROVINCE_TRIGGER_STATEMENTS_TAG)),
        "=",
        choice(
          ...GENERIC_SCOPES,
          $.tag,
          $.owner_ident,
          $.event_target_full_ident,
        ),
      ),
      seq(
        field("province_trigger", choice(...PROVINCE_TRIGGER_STATEMENTS_NUM)),
        "=",
        $.number,
      ),
      seq(
        field("province_trigger", choice(...PROVINCE_TRIGGER_STATEMENTS_IDENT)),
        "=",
        $.identifier,
      ), // TODO: more granular?
    ),

  province_trigger_statement_block: ($) =>
    choice(
      $.has_great_project,
      $.province_hidden_trigger,
      $.province_custom_trigger_tooltip,
      $.province_variable_arithmetic_trigger,
    ),

  country_variable_arithmetic_trigger: ($) =>
    seq(
      field("namespace", $.variable_arithmetic_trigger_ident),
      "=",
      "{",
      repeat1(
        choice(
          $.country_export_to_variable,
          $.country_math_variable,
          seq(field("argument", $.custom_tooltip_ident), "=", $.identifier),
          $.country_trigger_variable,
        ),
      ),
      "}",
    ),
  province_variable_arithmetic_trigger: ($) =>
    seq(
      field("namespace", $.variable_arithmetic_trigger_ident),
      "=",
      "{",
      repeat1(
        choice(
          $.province_export_to_variable,
          $.province_math_variable,
          seq(field("argument", $.custom_tooltip_ident), "=", $.identifier),
          $.province_trigger_variable,
        ),
      ),
      "}",
    ),

  country_trigger_variable: ($) =>
    seq(
      field("country_trigger", $.trigger_variable_combined_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.which_ident), "=", $.identifier),
          seq(
            field("argument", $.value_ident),
            "=",
            choice(
              $.trigger_value_full_ident,
              $.modifier_value_full_ident,
              $.number,
            ),
          ),
          seq(field("argument", $.identifier), "=", $.number),
        ),
      ),
      "}",
    ),

  province_trigger_variable: ($) =>
    seq(
      field("province_trigger", $.trigger_variable_combined_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.which_ident), "=", $.identifier),
          seq(
            field("argument", $.value_ident),
            "=",
            choice(
              $.trigger_value_full_ident,
              $.modifier_value_full_ident,
              $.number,
            ),
          ),
          seq(field("argument", $.identifier), "=", $.number),
        ),
      ),
      "}",
    ),

  country_math_variable: ($) =>
    seq(
      field("country_effect", $.effect_variable_combined_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.which_ident), "=", $.identifier),
          seq(
            field("argument", $.value_ident),
            "=",
            choice(
              $.trigger_value_full_ident,
              $.modifier_value_full_ident,
              $.number,
            ),
          ),
          seq(field("argument", $.identifier), "=", $.number),
        ),
      ),
      "}",
    ),

  province_math_variable: ($) =>
    seq(
      field("province_effect", $.effect_variable_combined_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.which_ident), "=", $.identifier),
          seq(
            field("argument", $.value_ident),
            "=",
            choice(
              $.trigger_value_full_ident,
              $.modifier_value_full_ident,
              $.number,
            ),
          ),
          seq(field("argument", $.identifier), "=", $.number),
        ),
      ),
      "}",
    ),

  country_export_to_variable: ($) =>
    seq(
      field("country_effect", $.export_to_variable_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.which_ident), "=", $.identifier),
          seq(field("argument", $.variable_name_ident), "=", $.identifier),
          seq(
            field("argument", $.value_ident),
            "=",
            choice(
              $.trigger_value_full_ident,
              $.modifier_value_full_ident,
              ...EXPORTABLE_VALUE_COUNTRY,
              $.number,
            ),
          ),
          seq(
            field("argument", $.who_ident),
            "=",
            choice(...GENERIC_SCOPES, $.tag),
          ),
        ),
      ),
      "}",
    ),
  province_export_to_variable: ($) =>
    seq(
      field("province_effect", $.export_to_variable_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.which_ident), "=", $.identifier),
          seq(field("argument", $.variable_name_ident), "=", $.identifier),
          seq(
            field("argument", $.value_ident),
            "=",
            choice(
              $.trigger_value_full_ident,
              $.modifier_value_full_ident,
              ...EXPORTABLE_VALUE_PROVINCE,
              $.number,
            ),
          ),
          seq(
            field("argument", $.who_ident),
            "=",
            choice(...GENERIC_SCOPES, $.tag),
          ),
        ),
      ),
      "}",
    ),
  country_custom_trigger_tooltip: ($) =>
    seq(
      field("country_trigger", $.custom_trigger_tooltip_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.tooltip_ident), "=", $.identifier),
          $.country_trigger_statement,
        ),
      ),
      "}",
    ),
  province_custom_trigger_tooltip: ($) =>
    seq(
      field("province_trigger", $.custom_trigger_tooltip_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.tooltip_ident), "=", $.identifier),
          $.province_trigger_statement,
        ),
      ),
      "}",
    ),
  province_hidden_trigger: ($) =>
    seq(
      field("province_trigger", $.hidden_trigger_ident),
      "=",
      "{",
      $.province_trigger_block,
      "}",
    ),
  has_great_project: ($) =>
    seq(
      field("province_trigger", $.has_great_project_ident),
      "=",
      "{",
      repeat1(
        choice(
          seq(field("argument", $.type_ident), "=", $.identifier),
          seq(field("argument", $.tier_ident), "=", $.number),
        ),
      ),
      "}",
    ),
  on_actions_file: ($) =>
    repeat1(
      choice($.on_action_province, $.on_action_country, $.on_action_unit),
    ),

  scripted_effects_file: ($) =>
    repeat1(
      choice(
        $.country_define_scripted_effect,
        $.province_define_scripted_effect,
      ),
    ),
  country_define_scripted_effect: ($) =>
    seq(
      field("country_effect", $.identifier),
      "=",
      "{",
      repeat1($.country_effect), // FIXME: support $arguments$ and [[arguments] here]
      "}",
    ),
  province_define_scripted_effect: ($) =>
    seq(
      field("province_effect", $.identifier),
      "=",
      "{",
      repeat1($.province_effect), // FIXME: support $arguments$ and [[arguments] here]
      "}",
    ),
  on_action_province: ($) =>
    seq(
      field("province_effect", choice(...ON_ACTION_PROVINCE)),
      "=",
      "{",
      repeat($.on_action_province_statement),
      "}",
    ),
  on_action_unit: ($) =>
    seq(
      choice(...ON_ACTION_UNIT),
      "=",
      "{",
      repeat($.unit_effect_scripted_effect), // NOTE: only scripted effects parsed for now
      "}",
    ),
  on_action_country: ($) =>
    seq(
      field("country_effect", choice(...ON_ACTION_COUNTRY)),
      "=",
      "{",
      repeat($.on_action_country_statement),
      "}",
    ),
  on_action_province_statement: ($) =>
    choice(
      $.on_action_events_block,
      $.on_action_random_events_block,
      $.province_effect,
    ),
  on_action_events_block: ($) =>
    seq(
      field("namespace", $.events_ident),
      "=",
      "{",
      repeat(choice($.string, $.identifier)),
      "}",
    ),
  on_action_random_events_block: ($) =>
    seq(
      field("namespace", $.random_events_ident),
      "=",
      "{",
      repeat(
        seq(
          field("argument", $.number),
          "=",
          choice($.string, $.identifier, $.number),
        ),
      ),
      "}",
    ),
  on_action_country_statement: ($) =>
    choice(
      $.on_action_events_block,
      $.on_action_random_events_block,
      $.country_effect,
    ),
  identifier: ($) => /[a-zA-Z0-9][a-zA-Z0-9\.\_]*/, // catch all needs to be at the end
  scripted_argument: ($) => /\$.+\$/,
  // _error_recovery: ($) => prec(-5, /[^{}]+/), // TODO: in the future, can error-guard some phrases by using this as an alternative in choice()
} /* end of rules */;

module.exports = grammar({
  name: "eu4mod",

  rules: { ...rules, ...grammar_gui },
  extras: ($) => [
    $.comment,
    $.scripted_argument,
    /[\s\f\uFEFF\u2060\u200B]|\r?\n/,
  ],
  conflicts: ($) => [
    // ignore unresolved conflicts for these pairs they should only be ambiguous
    // inside arbitrary scope changes like "ROOT" (which can be a province or
    // country scope depending on where it is -- including in complex ways like
    // on various on_actions)
    [$.country_effect, $.province_effect],
    [$.country_effect_statement_simple, $.province_effect_statement_simple],
    [$.country_trigger_statement, $.province_trigger_statement],
    [$.country_trigger_statement_simple, $.province_trigger_statement_simple],
    [$.country_random_list, $.province_random_list],
    [$.country_effect_statement_flag, $.province_effect_statement_flag],
    [$.country_trigger_statement_flag, $.province_trigger_statement_flag],
    [$.country_effect_trigger_switch, $.province_effect_trigger_switch],
    [$.country_effect_scripted_effect, $.province_effect_scripted_effect],
    [$.country_trigger_scripted_trigger, $.province_trigger_scripted_trigger],
    [$.country_modifier_block, $.province_modifier_block],
    [$.country_calc_true_if, $.province_calc_true_if],
    // [$.country_define_scripted_effect, $.province_define_scripted_effect],
    [$.country_random, $.province_random],
    [$.country_custom_trigger_tooltip, $.province_custom_trigger_tooltip],
    [$.country_export_to_variable, $.province_export_to_variable],
    [$.country_math_variable, $.province_math_variable],
    [$.country_trigger_variable, $.province_trigger_variable],
    [$.country_effect_change_scope, $.province_effect_change_scope],
    [$.country_custom_button_statement, $.province_custom_button_statement],
    [
      $.country_variable_arithmetic_trigger,
      $.province_variable_arithmetic_trigger,
    ],
  ],
  // reserved: ($) => ["limit", "if", "else_if", "else"], // TODO: more reserved?
});
