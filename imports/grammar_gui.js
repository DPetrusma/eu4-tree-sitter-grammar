module.exports = {
  // file: $ => choice(
  //   $.dot_mod,
  //   $.dot_gfx,
  //   $.dot_gui,
  //   $.dot_yml
  // ),

  //===============================================//
  //       MOD -> Rules for *.mod files :          //
  //===============================================//

  dot_mod_file: ($) => repeat1($._dot_mod_statement),

  _dot_mod_statement: ($) =>
    choice(
      $._statement_name,
      $._statement_mod_path,
      $._statement_mod_archive,
      $._statement_mod_remote_file_id,
      $._statement_mod_version,
      $._statement_mod_picture,
      $._statement_mod_supported_version,
      $._statement_mod_replace_path,
      $._statement_mod_tags,
      $._statement_mod_dependencies,
    ),

  //===============================================//
  //        GFX -> Rules for *.gfx files :         //
  //===============================================//

  dot_gfx_file: ($) => repeat1($._gfx_types_definition),

  _gfx_types_definition: ($) =>
    alias(
      choice($._spriteTypes, $._objectTypes, $._bitmapfonts),
      $.types_definition,
    ),

  //===============================================//
  //        GUI -> Rules for *.gui files :         //
  //===============================================//

  dot_gui_file: ($) => repeat1($._gui_types_definition),

  _gui_types_definition: ($) => alias(choice($._guiTypes), $.types_definition),

  //===============================================//
  //        YML -> Rules for *.yml files :         //
  //===============================================//

  dot_yml_file: ($) =>
    repeat1(
      seq(
        $.localization_language_name,
        token.immediate(":"),
        repeat1(token.immediate(/[ \s]*[\r?\n]/)),
        repeat(
          seq(
            token.immediate(" "),
            $._localization_entry,
            repeat1(token.immediate(/[ \s]*[\r?\n]/)),
          ),
        ),
        repeat(
          choice(
            token.immediate(" "),
            token.immediate(/[ \s]/),
            token.immediate(/[\r?\n]/),
          ),
        ),
      ),
    ),

  localization_language_name: ($) => token(seq("l_", /[a-z]+/)),

  _localization_entry: ($) =>
    seq(
      alias(token.immediate(/[a-zA-Z0-9_\.-]+/), $.identifier),
      token.immediate(":"),
      optional(alias(token.immediate(/[0-9]+/), $.index)),
      token.immediate(" "),
      $.localization_string,
      repeat(token.immediate(" ")),
      optional(prec(2, $.comment)),
    ),

  localization_string: ($) =>
    prec.left(
      seq(
        token.immediate('"'),
        repeat(
          choice(
            $.localization_string,
            $._localization_formatting,
            $._localization_scope,
            $._localization_icon,
            alias(token.immediate("¤"), $.localization_gold),
            alias(token.immediate(/\\[n\\\"]/), $.localization_color),
            alias(token.immediate(/\#/), $.formatting_boundary),
            alias(
              token.immediate(/\#Channel[a-zA-Z\/]+/),
              $.formatting_boundary,
            ),
            alias(token.immediate(/§[a-zA-Z!]/), $.localization_color),
            token.immediate(/[^\[\[\\$§£¤\"\#\r\n]+/),
          ),
        ),
        token.immediate('"'),
      ),
    ),

  _localization_icon: ($) =>
    prec.right(
      seq(
        alias(token.immediate("£"), $.formatting_boundary),
        alias(token.immediate(/[A-Za-z0-9_]+/), $.formatting_icon),
        optional(alias(token.immediate("£"), $.formatting_boundary)),
      ),
    ),

  _localization_scope: ($) =>
    seq(
      alias(token.immediate(/\[/), $.formatting_boundary),
      alias(
        token.immediate(
          seq(/[a-zA-Z0-9_@]+/, repeat(seq(/\./, /[a-zA-Z0-9_]+/))),
        ),
        $.formatting_variable,
      ),
      alias(token.immediate(/\]/), $.formatting_boundary),
    ),

  _localization_formatting: ($) =>
    seq(
      alias(token.immediate("$"), $.formatting_boundary),
      alias(token.immediate(/[A-Za-z0-9_]+/), $.formatting_variable),
      optional(
        seq(
          alias(token.immediate("|"), $.formatting_delimiter),
          optional($.formatting_rule),
        ),
      ),
      alias(token.immediate("$"), $.formatting_boundary),
    ),

  formatting_rule: ($) =>
    repeat1(
      token.immediate(choice("%", "*", "=", /[0-9]/, /[a-zA-Z]/, "+", "-")),
    ),

  //---------//
  // TYPES :
  //---------//

  // ----------
  // GFX types :

  // spriteTypes

  _spriteTypes: ($) =>
    seq(
      alias("spriteTypes", $.identifier),
      optional(seq("=", $._spriteTypes_block)),
    ),

  _spriteTypes_block: ($) =>
    seq(
      "{",
      repeat(choice($._spriteTypes_statement, $._spriteTypes_type)),
      "}",
    ),

  _spriteTypes_statement: ($) =>
    alias(choice($._statement_gfx_cursor_offset), $.statement),

  _spriteTypes_type: ($) =>
    alias(
      choice(
        $._spriteType,
        $._textSpriteType,
        $._corneredTileSpriteType,
        $._maskedShieldType,
        $._frameAnimatedSpriteType,
        $._progressbartype,
        $._PieChartType,
        $._LineChartType,
      ),
      $.type_definition,
    ),

  // objectTypes

  _objectTypes: ($) =>
    seq(
      alias("objectTypes", $.identifier),
      optional(seq("=", $._objectTypes_block)),
    ),

  _objectTypes_block: ($) => seq("{", repeat($._objectTypes_type), "}"),

  _objectTypes_type: ($) =>
    alias(
      choice(
        $._animatedmaptext,
        $._pdxmesh,
        $._pdxparticle,
        $._arrowType,
        $._tradeRouteType,
      ),
      $.type_definition,
    ),

  // bitmapfonts

  _bitmapfonts: ($) =>
    seq(
      alias("bitmapfonts", $.identifier),
      optional(seq("=", $._bitmapfonts_block)),
    ),

  _bitmapfonts_block: ($) => seq("{", repeat($._bitmapfonts_type), "}"),

  _bitmapfonts_type: ($) =>
    alias(choice($._bitmapfont, $._textcolors), $.type_definition),

  // ----------
  // GUI types :

  // guiTypes

  _guiTypes: ($) =>
    seq(alias("guiTypes", $.identifier), optional(seq("=", $._guiTypes_block))),

  _guiTypes_block: ($) =>
    seq("{", repeat(choice($._guiTypes_type, $._if_resolution_block)), "}"),

  _guiTypes_type: ($) =>
    alias(
      choice(
        $._windowType,
        $._textBoxType,
        $._instantTextBoxType,
        $._iconType,
        $._scrollbarType,
        $._smoothListboxType,
        $._positionType,
        $._guiButtonType,
        $._eu3dialogtype,
        $._listBoxType,
        $._overlappingElementsBoxType,
        $._extendedScrollbarType,
        $._containerWindowType,
      ),
      $.type_definition,
    ),

  //---------//
  // TYPE :
  //---------//

  // ----------
  // GFX type :

  // spriteType

  _spriteType: ($) =>
    seq(
      alias("spriteType", $.identifier),
      optional(seq("=", $._spriteType_block)),
    ),

  _spriteType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_textureFile,
            $._statement_gfx_noOfFrames,
            $._statement_gfx_overlay_frames_per_row,
            $._statement_gfx_overlay_rows,
            $._statement_gfx_effectFile,
            $._statement_gfx_clicksound,
            $._statement_gfx_norefcount,
            $._statement_gfx_legacy_lazy_load,
            $._statement_gfx_animation,
            $._statement_gfx_alwaystransparent,
            $._statement_gfx_transparencecheck,
            $._statement_gfx_loadType,
            $._statement_gfx_alphamaskfile,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // textSpriteType

  _textSpriteType: ($) =>
    seq(
      alias("textSpriteType", $.identifier),
      optional(seq("=", $._textSpriteType_block)),
    ),

  _textSpriteType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_textureFile,
            $._statement_gfx_noOfFrames,
            $._statement_gfx_overlay_frames_per_row,
            $._statement_gfx_overlay_rows,
            $._statement_gfx_loadType,
            $._statement_gfx_transparencecheck,
            $._statement_gfx_alwaystransparent,
            $._statement_gfx_effectFile,
            $._statement_gfx_clicksound,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // corneredTileSpriteType

  _corneredTileSpriteType: ($) =>
    seq(
      alias("corneredTileSpriteType", $.identifier),
      optional(seq("=", $._corneredTileSpriteType_block)),
    ),

  _corneredTileSpriteType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_size_xy,
            $._statement_gfx_textureFile,
            $._statement_gfx_borderSize,
            $._statement_gfx_alwaystransparent,
            $._statement_gfx_legacy_lazy_load,
            $._statement_gfx_noOfFrames,
            $._statement_gfx_norefcount,
            $._statement_gfx_loadType,
            $._statement_gfx_effectFile,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // maskedShieldType

  _maskedShieldType: ($) =>
    seq(
      alias("maskedShieldType", $.identifier),
      optional(seq("=", $._maskedShieldType_block)),
    ),

  _maskedShieldType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_textureFile1,
            $._statement_gfx_textureFile2,
            $._statement_gfx_textureFile3,
            $._statement_gfx_noOfFrames,
            $._statement_gfx_effectFile,
            $._statement_gfx_overlay_frames_per_row,
            $._statement_gfx_overlay_rows,
            $._statement_gfx_transparencecheck,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // animatedmaptext

  _animatedmaptext: ($) =>
    seq(
      alias("animatedmaptext", $.identifier),
      optional(seq("=", $._animatedmaptext_block)),
    ),

  _animatedmaptext_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_speed,
            $._statement_gfx_textblock,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // textcolors

  _textcolors: ($) =>
    seq(
      alias("textcolors", $.identifier),
      optional(seq("=", $._textcolors_block)),
    ),

  _textcolors_block: ($) =>
    seq(
      "{",
      repeat(alias(choice($._statement_gfx_textcolors), $.statement)),
      "}",
    ),

  // bitmapfont

  _bitmapfont: ($) =>
    seq(
      alias("bitmapfont", $.identifier),
      optional(seq("=", $._bitmapfont_block)),
    ),

  _bitmapfont_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._textcolors,
            $._statement_gfx_name,
            $._statement_gfx_path,
            $._statement_gfx_bitmapfont_color,
            $._statement_gfx_bitmapfont_border_color,
            $._statement_gfx_cursor_offset,
            $._statement_gfx_effect_bool,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // frameAnimatedSpriteType

  _frameAnimatedSpriteType: ($) =>
    seq(
      alias("frameAnimatedSpriteType", $.identifier),
      optional(seq("=", $._frameAnimatedSpriteType_block)),
    ),

  _frameAnimatedSpriteType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_textureFile,
            $._statement_gfx_noOfFrames,
            $._statement_gfx_overlay_frames_per_row,
            $._statement_gfx_overlay_rows,
            $._statement_gfx_effectFile,
            $._statement_gfx_animation_rate_fps,
            $._statement_gfx_looping,
            $._statement_gfx_play_on_show,
            $._statement_gfx_pause_on_loop,
            $._statement_gfx_alwaystransparent,
            $._statement_gfx_transparencecheck,
            $._statement_gfx_loadType,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // progressbartype

  _progressbartype: ($) =>
    seq(
      alias("progressbartype", $.identifier),
      optional(seq("=", $._progressbartype_block)),
    ),

  _progressbartype_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_color,
            $._statement_gfx_colortwo,
            $._statement_gfx_textureFile1,
            $._statement_gfx_textureFile2,
            $._statement_gfx_size_xy,
            $._statement_gfx_effectFile,
            $._statement_gfx_horizontal,
            $._statement_gfx_loadType,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // pdxmesh

  _pdxmesh: ($) =>
    seq(alias("pdxmesh", $.identifier), optional(seq("=", $._pdxmesh_block))),

  _pdxmesh_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_pdxmesh_animation,
            $._statement_gfx_pdxmesh_meshsettings,
            $._statement_gfx_name,
            $._statement_gfx_file,
            $._statement_gfx_scale,
            $._statement_gfx_cull_distance,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // pdxparticle

  _pdxparticle: ($) =>
    seq(
      alias("pdxparticle", $.identifier),
      optional(seq("=", $._pdxparticle_block)),
    ),

  _pdxparticle_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_type,
            $._statement_gfx_scale,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // arrowType

  _arrowType: ($) =>
    seq(
      alias("arrowType", $.identifier),
      optional(seq("=", $._arrowType_block)),
    ),

  _arrowType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_texture,
            $._statement_gfx_normal,
            $._statement_gfx_specular,
            $._statement_gfx_effect,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // tradeRouteType

  _tradeRouteType: ($) =>
    seq(
      alias("tradeRouteType", $.identifier),
      optional(seq("=", $._tradeRouteType_block)),
    ),

  _tradeRouteType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_textureFile,
            $._statement_gfx_textureFile2,
            $._statement_gfx_textureFile3,
            $._statement_gfx_effect,
            $._statement_gfx_cull_distance,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // PieChartType

  _PieChartType: ($) =>
    seq(
      alias("PieChartType", $.identifier),
      optional(seq("=", $._PieChartType_block)),
    ),

  _PieChartType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice($._statement_gfx_name, $._statement_gfx_size_integer),
          $.statement,
        ),
      ),
      "}",
    ),

  // LineChartType

  _LineChartType: ($) =>
    seq(
      alias("LineChartType", $.identifier),
      optional(seq("=", $._LineChartType_block)),
    ),

  _LineChartType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_gfx_name,
            $._statement_gfx_size_xy,
            $._statement_gfx_linewidth,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // ----------
  // GUI type :

  // windowType

  _windowType: ($) =>
    seq(
      alias(/[Ww]indowType/, $.identifier),
      optional(seq("=", $._windowType_block)),
    ),

  _windowType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(
            choice(
              $._if_resolution,
              $._windowType,
              $._listBoxType,
              $._editBoxType,
              $._iconType,
              $._instantTextBoxType,
              $._smoothListboxType,
              $._guiButtonType,
              $._overlappingElementsBoxType,
              $._browserType,
              $._checkboxType,
              $._scrollbarType,
              $._textBoxType,
              $._gridBoxType,
              $._positionType,
            ),
            $.type_definition,
          ),
          alias(
            choice(
              $._statement_name,
              $._statement_scripted,
              $._statement_gui_background,
              $._statement_gui_position,
              $._statement_gui_size,
              $._statement_gui_moveable,
              $._statement_gui_orientation,
              $._statement_gui_dontRender,
              $._statement_gui_horizontalBorder,
              $._statement_gui_verticalBorder,
              $._statement_gui_fullScreen,
              $._statement_gui_upsound,
              $._statement_gui_downsound,
              $._statement_gui_show_position,
              $._statement_gui_hide_position,
              $._statement_gui_animation_type,
              $._statement_gui_animation_time,
              $._statement_gui_click_to_front,
              $._statement_gui_priority,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // listBoxType

  _listBoxType: ($) =>
    seq(
      alias(/list[Bb]oxType/, $.identifier),
      optional(seq("=", $._listBoxType_block)),
    ),

  _listBoxType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(choice($._if_resolution), $.type_definition),
          alias(
            choice(
              $._statement_name,
              $._statement_gui_background,
              $._statement_gui_position,
              $._statement_gui_orientation,
              $._statement_gui_horizontal,
              $._statement_gui_priority,
              $._statement_gui_size,
              $._statement_gui_borderSize,
              $._statement_gui_scrollbartype,
              $._statement_gui_scrollbar_side,
              $._statement_gui_alwaystransparent,
              $._statement_gui_spacing,
              $._statement_gui_offset,
              $._statement_gui_step,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // editBoxType

  _editBoxType: ($) =>
    seq(
      alias("editBoxType", $.identifier),
      optional(seq("=", $._editBoxType_block)),
    ),

  _editBoxType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_position,
            $._statement_gui_textureFile,
            $._statement_gui_font,
            $._statement_gui_borderSize,
            $._statement_gui_cursor,
            $._statement_gui_size,
            $._statement_gui_text,
            $._statement_gui_orientation,
            $._statement_gui_instantTextBoxType,
            $._statement_gui_ignore_tab_navigation,
            $._statement_gui_use_special_chars,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // instantTextBoxType

  _instantTextBoxType: ($) =>
    seq(
      alias(/instant[Tt]ext[Bb]oxType/, $.identifier),
      optional(seq("=", $._instantTextBoxType_block)),
    ),

  _instantTextBoxType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(choice($._if_resolution), $.type_definition),
          alias(
            choice(
              $._statement_name,
              $._statement_scripted,
              $._statement_gui_position,
              $._statement_gui_textureFile,
              $._statement_gui_font,
              $._statement_gui_text,
              $._statement_gui_pdx_tooltip,
              $._statement_gui_pdx_tooltip_delayed,
              $._statement_gui_borderSize,
              $._statement_gui_maxWidth,
              $._statement_gui_maxHeight,
              $._statement_gui_format,
              $._statement_gui_fixedsize,
              $._statement_gui_orientation,
              $._statement_gui_truncate,
              $._statement_gui_fixedsize,
              $._statement_gui_alwaystransparent,
              $._statement_gui_hint_tag,
              $._statement_gui_scrollbartype,
              $._statement_gui_text_color_code,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // textBoxType

  _textBoxType: ($) =>
    seq(
      alias("textBoxType", $.identifier),
      optional(seq("=", $._textBoxType_block)),
    ),

  _textBoxType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_position,
            $._statement_gui_orientation,
            $._statement_gui_textureFile,
            $._statement_gui_borderSize,
            $._statement_gui_maxWidth,
            $._statement_gui_maxHeight,
            $._statement_gui_text,
            $._statement_gui_font,
            $._statement_gui_format,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // iconType

  _iconType: ($) =>
    seq(alias("iconType", $.identifier), optional(seq("=", $._iconType_block))),

  _iconType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(choice($._if_resolution), $.type_definition),
          alias(
            choice(
              $._statement_name,
              $._statement_scripted,
              $._statement_gui_spriteType,
              $._statement_gui_position,
              $._statement_gui_orientation,
              $._statement_gui_rotation,
              $._statement_gui_frame,
              $._statement_gui_alwaystransparent,
              $._statement_gui_scale,
              $._statement_gui_hint_tag,
              $._statement_gui_tooltip,
              $._statement_gui_tooltipText,
              $._statement_gui_delayedTooltipText,
              $._statement_gui_pdx_tooltip,
              $._statement_gui_pdx_tooltip_delayed,
              $._statement_gui_quadTextureSprite,
              $._statement_gui_buttonMesh,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // scrollbarType

  _scrollbarType: ($) =>
    seq(
      alias("scrollbarType", $.identifier),
      optional(seq("=", $._scrollbarType_block)),
    ),

  _scrollbarType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(choice($._guiButtonType), $.type_definition),
          alias(
            choice(
              $._statement_name,
              $._statement_gui_slider,
              $._statement_gui_track,
              $._statement_gui_leftbutton,
              $._statement_gui_rightbutton,
              $._statement_gui_size,
              $._statement_gui_position,
              $._statement_gui_priority,
              $._statement_gui_borderSize,
              $._statement_gui_maxValue,
              $._statement_gui_minValue,
              $._statement_gui_stepSize,
              $._statement_gui_startValue,
              $._statement_gui_horizontal,
              $._statement_gui_scroll_speed,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // guiButtonType

  _guiButtonType: ($) =>
    seq(
      alias("guiButtonType", $.identifier),
      optional(seq("=", $._guiButtonType_block)),
    ),

  _guiButtonType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(choice($._if_resolution), $.type_definition),
          alias(
            choice(
              $._statement_name,
              $._statement_scripted,
              $._statement_gui_quadTextureSprite,
              $._statement_gui_position,
              $._statement_gui_orientation,
              $._statement_gui_parent,
              $._statement_gui_tooltip,
              $._statement_gui_tooltipText,
              $._statement_gui_pdx_tooltip,
              $._statement_gui_pdx_tooltip_delayed,
              $._statement_gui_delayedTooltipText,
              $._statement_gui_buttonText,
              $._statement_gui_buttonFont,
              $._statement_gui_shortcut,
              $._statement_gui_extra_shortcut,
              $._statement_gui_size,
              $._statement_gui_borderSize,
              $._statement_gui_scale,
              $._statement_gui_max_height,
              $._statement_gui_min_height,
              $._statement_gui_spriteType,
              $._statement_gui_clicksound,
              $._statement_gui_no_clicksound,
              $._statement_gui_hint_tag,
              $._statement_gui_frame,
              $._statement_gui_text,
              $._statement_gui_font,
              $._statement_gui_web_link,
              $._statement_gui_format,
              $._statement_gui_alwaystransparent,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // smoothListboxType

  _smoothListboxType: ($) =>
    seq(
      alias(/smoothList[Bb]oxType/, $.identifier),
      optional(seq("=", $._smoothListboxType_block)),
    ),

  _smoothListboxType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(choice($._if_resolution), $.type_definition),
          alias(
            choice(
              $._statement_name,
              $._statement_gui_position,
              $._statement_gui_background,
              $._statement_gui_size,
              $._statement_gui_orientation,
              $._statement_gui_horizontal,
              $._statement_gui_spacing,
              $._statement_gui_scrollbartype,
              $._statement_gui_borderSize,
              $._statement_gui_offset,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // if_resolution

  _if_resolution: ($) =>
    seq(
      alias("if_resolution", $.identifier),
      optional(
        seq(
          "=",
          "{",
          repeat(
            choice(
              alias(
                choice(
                  $._statement_gui_spriteType,
                  $._statement_gui_position,
                  $._statement_gui_size,
                  $._statement_gui_min_height,
                  $._statement_gui_maxHeight,
                  $._statement_gui_max_height,
                  $._statement_gui_maxWidth,
                  $._statement_gui_quadTextureSprite,
                  $._statement_gui_buttonText,
                  $._statement_gui_show_position,
                  $._statement_gui_hide_position,
                ),
                $.statement,
              ),
              alias(
                choice(
                  $._listBoxType,
                  $._editBoxType,
                  $._iconType,
                  $._instantTextBoxType,
                  $._smoothListboxType,
                  $._guiButtonType,
                  $._overlappingElementsBoxType,
                  $._browserType,
                  $._checkboxType,
                  $._scrollbarType,
                  $._textBoxType,
                  $._gridBoxType,
                  $._positionType,
                ),
                $.type_definition,
              ),
            ),
          ),
          "}",
        ),
      ),
    ),

  // if_resolution_block

  _if_resolution_block: ($) =>
    seq(
      alias("if_resolution", $.identifier),
      optional(
        seq(
          "=",
          "{",
          repeat(
            choice(
              alias(
                choice(
                  $._listBoxType,
                  $._editBoxType,
                  $._iconType,
                  $._instantTextBoxType,
                  $._smoothListboxType,
                  $._guiButtonType,
                  $._overlappingElementsBoxType,
                  $._browserType,
                  $._checkboxType,
                  $._scrollbarType,
                  $._textBoxType,
                  $._gridBoxType,
                  $._positionType,
                ),
                $.type_definition,
              ),
              alias(
                choice(
                  $._statement_gui_min_height,
                  $._statement_gui_maxHeight,
                  $._statement_gui_max_height,
                  $._statement_gui_maxWidth,
                  $._statement_name,
                  $._statement_gui_background,
                  $._statement_gui_position,
                  $._statement_gui_size,
                  $._statement_gui_moveable,
                  $._statement_gui_orientation,
                  $._statement_gui_dontRender,
                  $._statement_gui_horizontalBorder,
                  $._statement_gui_verticalBorder,
                  $._statement_gui_fullScreen,
                  $._statement_gui_upsound,
                  $._statement_gui_downsound,
                  $._statement_gui_show_position,
                  $._statement_gui_hide_position,
                  $._statement_gui_animation_type,
                  $._statement_gui_animation_time,
                  $._statement_gui_click_to_front,
                  $._statement_gui_priority,
                  $._statement_gui_spriteType,
                  $._statement_gui_position,
                  $._statement_gui_size,
                  $._statement_gui_min_height,
                  $._statement_gui_maxHeight,
                  $._statement_gui_max_height,
                  $._statement_gui_maxWidth,
                  $._statement_gui_quadTextureSprite,
                  $._statement_gui_buttonText,
                  $._statement_gui_show_position,
                  $._statement_gui_hide_position,
                ),
                $.statement,
              ),
            ),
          ),
          "}",
        ),
      ),
    ),

  // positionType

  _positionType: ($) =>
    seq(
      alias("positionType", $.identifier),
      optional(seq("=", $._positionType_block)),
    ),

  _positionType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice($._statement_name, $._statement_gui_position),
          $.statement,
        ),
      ),
      "}",
    ),

  // overlappingElementsBoxType

  _overlappingElementsBoxType: ($) =>
    seq(
      alias(/[Oo]verlappingElementsBoxType/, $.identifier),
      optional(seq("=", $._overlappingElementsBoxType_block)),
    ),

  _overlappingElementsBoxType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_position,
            $._statement_gui_size,
            $._statement_gui_orientation,
            $._statement_gui_format,
            $._statement_gui_spacing,
            $._statement_gui_hint_tag,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // browserType

  _browserType: ($) =>
    seq(
      alias("browserType", $.identifier),
      optional(seq("=", $._browserType_block)),
    ),

  _browserType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_position,
            $._statement_gui_size,
            $._statement_gui_spriteType,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // eu3dialogtype

  _eu3dialogtype: ($) =>
    seq(
      alias("eu3dialogtype", $.identifier),
      optional(seq("=", $._eu3dialogtype_block)),
    ),

  _eu3dialogtype_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(
            choice(
              $._windowType,
              $._iconType,
              $._instantTextBoxType,
              $._guiButtonType,
              $._shieldtype,
              $._checkboxType,
              $._listBoxType,
              $._scrollbarType,
              $._overlappingElementsBoxType,
              $._editBoxType,
            ),
            $.type_definition,
          ),
          alias(
            choice(
              $._statement_name,
              $._statement_gui_background,
              $._statement_gui_position,
              $._statement_gui_orientation,
              $._statement_gui_size,
              $._statement_gui_moveable,
              $._statement_gui_dontRender,
              $._statement_gui_horizontalBorder,
              $._statement_gui_verticalBorder,
              $._statement_gui_fullScreen,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // shieldtype

  _shieldtype: ($) =>
    seq(
      alias("shieldtype", $.identifier),
      optional(seq("=", $._shieldtype_block)),
    ),

  _shieldtype_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_position,
            $._statement_gui_spriteType,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // checkboxType

  _checkboxType: ($) =>
    seq(
      alias("checkboxType", $.identifier),
      optional(seq("=", $._checkboxType_block)),
    ),

  _checkboxType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(choice($._if_resolution), $.type_definition),
          alias(
            choice(
              $._statement_name,
              $._statement_gui_position,
              $._statement_gui_orientation,
              $._statement_gui_quadTextureSprite,
              $._statement_gui_tooltip,
              $._statement_gui_tooltipText,
              $._statement_gui_delayedTooltipText,
              $._statement_gui_pdx_tooltip,
              $._statement_gui_pdx_tooltip_delayed,
              $._statement_gui_buttonText,
              $._statement_gui_buttonFont,
              $._statement_gui_alwaystransparent,
              $._statement_gui_shortcut,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // gridBoxType

  _gridBoxType: ($) =>
    seq(
      alias("gridBoxType", $.identifier),
      optional(seq("=", $._gridBoxType_block)),
    ),

  _gridBoxType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_position,
            $._statement_gui_size_width_height,
            $._statement_gui_format,
            $._statement_gui_slotsize,
            $._statement_gui_max_slots_horizontal,
            $._statement_gui_max_slots_vertical,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // extendedScrollbarType

  _extendedScrollbarType: ($) =>
    seq(
      alias("extendedScrollbarType", $.identifier),
      optional(seq("=", $._extendedScrollbarType_block)),
    ),

  _extendedScrollbarType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(
            choice($._slider, $._track, $._decreaseButton, $._increaseButton),
            $.type_definition,
          ),
          alias(
            choice(
              $._statement_name,
              $._statement_gui_position,
              $._statement_gui_size_width_height,
              $._statement_gui_startValue,
              $._statement_gui_tileSize,
              $._statement_gui_maxValue,
              $._statement_gui_minValue,
              $._statement_gui_stepSize,
              $._statement_gui_horizontal_bool,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // slider

  _slider: ($) =>
    seq(alias("slider", $.identifier), optional(seq("=", $._slider_block))),

  _slider_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_quadTextureSprite,
            $._statement_gui_position,
            $._statement_gui_pdx_tooltip,
            $._statement_gui_pdx_tooltip_delayed,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // track

  _track: ($) =>
    seq(alias("track", $.identifier), optional(seq("=", $._track_block))),

  _track_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_quadTextureSprite,
            $._statement_gui_position,
            $._statement_gui_alwaystransparent,
            $._statement_gui_pdx_tooltip,
            $._statement_gui_pdx_tooltip_delayed,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // decreaseButton

  _decreaseButton: ($) =>
    seq(
      alias("decreaseButton", $.identifier),
      optional(seq("=", $._decreaseButton_block)),
    ),

  _decreaseButton_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_quadTextureSprite,
            $._statement_gui_position,
            $._statement_gui_pdx_tooltip,
            $._statement_gui_pdx_tooltip_delayed,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // increaseButton

  _increaseButton: ($) =>
    seq(
      alias("increaseButton", $.identifier),
      optional(seq("=", $._increaseButton_block)),
    ),

  _increaseButton_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_quadTextureSprite,
            $._statement_gui_position,
            $._statement_gui_pdx_tooltip,
            $._statement_gui_pdx_tooltip_delayed,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // containerWindowType

  _containerWindowType: ($) =>
    seq(
      alias("containerWindowType", $.identifier),
      optional(seq("=", $._containerWindowType_block)),
    ),

  _containerWindowType_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          alias(
            choice(
              $._containerWindowType,
              $._background,
              $._buttonType,
              $._instantTextBoxType,
              $._iconType,
              $._extendedScrollbarType,
              $._gridBoxType,
              $._smoothListboxType,
              $._editBoxType,
            ),
            $.type_definition,
          ),
          alias(
            choice(
              $._statement_name,
              $._statement_gui_position,
              $._statement_gui_show_position,
              $._statement_gui_show_animation_type,
              $._statement_gui_hide_animation_type,
              $._statement_gui_animation_time,
              $._statement_gui_orientation,
              $._statement_gui_size_width_height,
              $._statement_gui_origo,
              $._statement_gui_fade_time,
              $._statement_gui_fade_type,
              $._statement_gui_click_to_front,
              $._statement_gui_moveable,
              $._statement_gui_margin,
              $._statement_gui_verticalScrollbar,
            ),
            $.statement,
          ),
        ),
      ),
      "}",
    ),

  // background

  _background: ($) =>
    seq(
      alias("background", $.identifier),
      optional(seq("=", $._background_block)),
    ),

  _background_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_spriteType,
            $._statement_gui_quadTextureSprite,
            $._statement_gui_alwaystransparent,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  // buttonType

  _buttonType: ($) =>
    seq(
      alias(/[Bb]utton[Tt]ype/, $.identifier),
      optional(seq("=", $._buttonType_block)),
    ),

  _buttonType_block: ($) =>
    seq(
      "{",
      repeat(
        alias(
          choice(
            $._statement_name,
            $._statement_gui_quadTextureSprite,
            $._statement_gui_position,
            $._statement_gui_orientation,
            $._statement_gui_buttonText,
            $._statement_gui_buttonFont,
            $._statement_gui_tooltip,
            $._statement_gui_tooltipText,
            $._statement_gui_delayedTooltipText,
            $._statement_gui_pdx_tooltip,
            $._statement_gui_pdx_tooltip_delayed,
            $._statement_gui_clicksound,
            $._statement_gui_shortcut,
            $._statement_gui_spriteType,
            $._statement_gui_size,
          ),
          $.statement,
        ),
      ),
      "}",
    ),

  //==============================//
  //          STATEMENTS          //
  //==============================//

  //-------------------------------------//
  //  Commons statements [_statement_X]  //
  //-------------------------------------//

  _statement_name: ($) =>
    seq(
      alias("name", $.name_identifier),
      optional(seq("=", alias(choice($.string, $.identifier), $.name_value))),
    ),

  _statement_string: ($) => seq($.identifier, optional(seq("=", $.string))),

  _statement_xy_integer: ($) =>
    choice(
      seq($._entry_x_integer, optional("ยง"), $._entry_y_integer),
      seq($._entry_y_integer, optional("ยง"), $._entry_x_integer),
    ),

  _statement_scripted: ($) =>
    seq(alias("scripted", $.identifier), optional(seq("=", $.bool))),

  _entry_x_integer: ($) => seq("x", optional(seq("=", $.integer))),

  _entry_y_integer: ($) => seq("y", optional(seq("=", $.integer))),

  _statement_xy_float: ($) =>
    choice(
      seq($._entry_x_float, optional("ยง"), $._entry_y_float),
      seq($._entry_y_float, optional("ยง"), $._entry_x_float),
    ),

  _entry_x_float: ($) =>
    seq(alias("x", $.keyword), optional(seq("=", $.number))),

  _entry_y_float: ($) =>
    seq(alias("y", $.keyword), optional(seq("=", $.number))),

  _statement_width_height_integer: ($) =>
    choice(
      seq($._entry_width_integer, $._entry_height_integer),
      seq($._entry_height_integer, $._entry_width_integer),
    ),

  _entry_width_integer: ($) =>
    seq(
      alias("width", $.keyword),
      optional(seq("=", $.integer, optional(choice("%", "%%")))),
    ),

  _entry_height_integer: ($) =>
    seq(
      alias("height", $.keyword),
      optional(
        seq("=", $.integer, optional(alias(choice("%", "%%"), $.keyword))),
      ),
    ),

  _statement_margin_integer: ($) =>
    repeat1(
      choice(
        $._entry_top_integer,
        $._entry_left_integer,
        $._entry_bottom_integer,
        $._entry_right_integer,
      ),
    ),

  _entry_top_integer: ($) =>
    seq(alias("top", $.keyword), optional(seq("=", $.integer))),

  _entry_left_integer: ($) =>
    seq(alias("left", $.keyword), optional(seq("=", $.integer))),

  _entry_bottom_integer: ($) =>
    seq(alias("bottom", $.keyword), optional(seq("=", $.integer))),

  _entry_right_integer: ($) =>
    seq(alias("right", $.keyword), optional(seq("=", $.integer))),

  //-------------------------------------//
  //  MOD statements [_statement_mod_X]  //
  //-------------------------------------//

  _statement_mod_path: ($) =>
    seq(alias("path", $.identifier), optional(seq("=", $.string))),

  _statement_mod_archive: ($) =>
    seq(
      alias("archive", $.identifier),
      optional(seq("=", alias(token(seq('"', /[^\"\n]*/, '.zip"')), $.string))),
    ),

  _statement_mod_remote_file_id: ($) =>
    seq(
      alias("remote_file_id", $.identifier),
      optional(seq("=", alias(token(seq('"', /\d*/, '"')), $.string))),
    ),

  _statement_mod_version: ($) =>
    seq(
      alias("version", $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(seq('"', /[0-9]+/, repeat(seq(".", /[0-9]+/)), '"')),
            $.string,
          ),
        ),
      ),
    ),

  _statement_mod_picture: ($) =>
    seq(
      alias("picture", $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(seq('"', /[^\"\n]*/, choice(".jpg", ".png"), '"')),
            $.string,
          ),
        ),
      ),
    ),

  _statement_mod_supported_version: ($) =>
    seq(
      alias("supported_version", $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(
              seq(
                '"',
                /[0-9]+/,
                ".",
                /[0-9]+/,
                optional(
                  token(
                    seq(
                      ".",
                      choice(/[0-9]+/, "*"),
                      optional(token(seq(".", choice(/[0-9]+/, "*")))),
                    ),
                  ),
                ),
                '"',
              ),
            ),
            $.string,
          ),
        ),
      ),
    ),

  _statement_mod_replace_path: ($) =>
    seq(
      alias("replace_path", $.identifier),
      optional(seq("=", $._mod_replace_path_folder)),
    ),

  _mod_replace_path_folder: ($) =>
    alias(
      token(
        seq(
          '"',
          choice(
            "common",
            "decisions",
            "events",
            "gfx",
            "history",
            "interface",
            "localisation",
            "map",
            "missions",
            "tutorial",
          ),
          optional(/[^\"\n]+/),
          '"',
        ),
      ),
      $.string,
    ),

  _statement_mod_tags: ($) =>
    seq(alias("tags", $.identifier), optional(seq("=", $._mod_tags_block))),

  _mod_tags_block: ($) => seq("{", repeat($.string), "}"),

  // _mod_tags_keyword: ($) =>
  //   alias(
  //     choice(
  //       /"[Aa]lternative [Hh]istory"/,
  //       /"[Bb]alance"/,
  //       /"[Ee]vents"/,
  //       /"[Ee]xpansion"/,
  //       /"[Ff]ixes"/,
  //       /"[Gg]ameplay"/,
  //       /"[Gg]raphics"/,
  //       /"[Gg]uide"/,
  //       /"[Hh]istorical"/,
  //       /"[Ll]oading [Ss]creen"/,
  //       /"[Mm]ap"/,
  //       /"[Mm]ilitary"/,
  //       /"[Mm]issions [Aa]nd [Dd]ecisions"/,
  //       /"[Nn]ational [Ii]deas"/,
  //       /"[Nn]ew [Nn]ations"/,
  //       /"[Rr]eligion"/,
  //       /"[Ss]ound"/,
  //       /"[Tt]echnologies"/,
  //       /"[Tt]rade"/,
  //       /"[Tt]ranslation"/,
  //       /"[Uu]tilities"/,
  //       /"[Cc]onverted [Ff]rom CKII"/,
  //     ),
  //     $.tags_keyword,
  //   ),

  _statement_mod_dependencies: ($) =>
    seq(
      alias("dependencies", $.identifier),
      optional(seq("=", $._mod_dependencies_block)),
    ),

  _mod_dependencies_block: ($) =>
    seq("{", repeat(alias($.string, $.dependencies)), "}"),

  //-------------------------------------//
  //  GFX statements [_statement_gfx_X]  //
  //-------------------------------------//

  _statement_gfx_name: ($) =>
    seq(
      alias("name", $.name_identifier),
      optional(
        seq(
          "=",
          choice(
            alias(
              token(seq(optional('"'), /[a-zA-Z0-9_:.'-]*/, optional('"'))),
              $.name_value,
            ),
            alias(
              token(seq('"GFX_', /[a-zA-Z0-9_:.'-]*/, '"')),
              $.name_gfx_value,
            ),
          ),
        ),
      ),
    ),

  _statement_gfx_path: ($) =>
    seq(alias("path", $.identifier), optional(seq("=", $.string))),

  _statement_gfx_cursor_offset: ($) =>
    seq(
      alias("cursor_offset", $.identifier),
      optional(seq("=", "{", $.integer, $.integer, "}")),
    ),

  _statement_gfx_textureFile: ($) =>
    seq(
      alias(/texture[Ff]ile/, $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(seq('"', /[^\"\n]+/, choice(".dds", ".tga"), '"')),
            $.string,
          ),
        ),
      ),
    ),

  _statement_gfx_textureFile1: ($) =>
    seq(
      alias(/texture[Ff]ile1/, $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(seq('"', /[^\"\n]+/, choice(".dds", ".tga"), '"')),
            $.string,
          ),
        ),
      ),
    ),

  _statement_gfx_textureFile2: ($) =>
    seq(
      alias(/texture[Ff]ile2/, $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(seq('"', /[^\"\n]+/, choice(".dds", ".tga"), '"')),
            $.string,
          ),
        ),
      ),
    ),

  _statement_gfx_textureFile3: ($) =>
    seq(
      alias(/texture[Ff]ile3/, $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(seq('"', /[^\"\n]+/, choice(".dds", ".tga"), '"')),
            $.string,
          ),
        ),
      ),
      optional(";"),
    ),

  _statement_gfx_noOfFrames: ($) =>
    seq(alias("noOfFrames", $.identifier), optional(seq("=", $.integer))),

  _statement_gfx_overlay_frames_per_row: ($) =>
    seq(
      alias("overlay_frames_per_row", $.identifier),
      optional(seq("=", $.integer)),
    ),

  _statement_gfx_overlay_rows: ($) =>
    seq(alias("overlay_rows", $.identifier), optional(seq("=", $.integer))),

  _statement_gfx_effectFile: ($) =>
    seq(
      alias("effectFile", $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(seq('"', /[^\"\n]+/, choice(".lua", ".shader"), '"')),
            $.string,
          ),
        ),
      ),
    ),

  _statement_gfx_animation: ($) =>
    seq(
      alias("animation", $.identifier),
      optional(seq("=", $._gfx_animation_block)),
    ),

  _gfx_animation_block: ($) =>
    seq(
      "{",
      repeat(
        choice(
          $._animation_entry_dds,
          $._animation_entry_angle,
          $._animation_entry_bool,
          $._animation_entry_time,
          $._animation_entry_xy_float,
          $._animation_entry_blendmode,
          $._animation_entry_type,
          $._animation_entry_frames,
        ),
      ),
      "}",
    ),

  _animation_entry_dds: ($) =>
    seq(
      alias(choice("animationmaskfile", "animationtexturefile"), $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".dds", '"')), $.string)),
      ),
    ),

  _animation_entry_angle: ($) =>
    seq(alias("animationrotation", $.identifier), optional(seq("=", $.angle))),

  _animation_entry_bool: ($) =>
    seq(alias("animationlooping", $.identifier), optional(seq("=", $.bool))),

  _animation_entry_time: ($) =>
    seq(
      alias(choice("animationtime", "animationdelay"), $.identifier),
      optional(seq("=", $.number)),
    ),

  _animation_entry_xy_float: ($) =>
    seq(
      alias(
        choice("animationrotationoffset", "animationtexturescale"),
        $.identifier,
      ),
      optional(seq("=", "{", $._statement_xy_float, "}")),
    ),

  _animation_entry_blendmode: ($) =>
    seq(
      alias("animationblendmode", $.identifier),
      optional(
        seq("=", alias(choice('"add"', '"multiply"', '"overlay"'), $.string)),
      ),
    ),

  _animation_entry_type: ($) =>
    seq(
      alias("animationtype", $.identifier),
      optional(
        seq(
          "=",
          alias(choice('"scrolling"', '"rotating"', '"pulsing"'), $.string),
        ),
      ),
    ),

  _animation_entry_frames: ($) =>
    seq(
      alias("animationframes", $.identifier),
      optional(seq("=", "{", repeat1($.integer), "}")),
    ),

  _statement_gfx_size_xy: ($) =>
    seq(
      alias("size", $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gfx_size_integer: ($) =>
    seq(alias("size", $.identifier), optional(seq("=", $.integer))),

  _statement_gfx_borderSize: ($) =>
    seq(
      alias(/border[Ss]ize/, $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gfx_alwaystransparent: ($) =>
    seq(
      alias(/all?ways[Tt]ransparent/, $.identifier),
      optional(seq("=", $.bool)),
    ),

  _statement_gfx_legacy_lazy_load: ($) =>
    seq(alias("legacy_lazy_load", $.identifier), optional(seq("=", $.bool))),

  _statement_gfx_clicksound: ($) =>
    seq(
      alias("clicksound", $.identifier),
      optional(seq("=", alias($.identifier, $.keyword))),
    ),

  _statement_gfx_speed: ($) =>
    seq(alias("speed", $.identifier), optional(seq("=", $.number))),

  _statement_gfx_textblock: ($) =>
    seq(alias("textblock", $.identifier), optional(seq("=", $._gfx_textblock))),

  _gfx_textblock: ($) =>
    seq(
      "{",
      repeat(
        choice(
          $._statement_gfx_text,
          $._statement_gfx_color,
          $._statement_gfx_font,
          $._statement_gfx_position,
          $._statement_gfx_size_xy,
          $._statement_gfx_format,
          $._statement_gfx_cull_distance,
        ),
      ),
      "}",
    ),

  _statement_gfx_text: ($) =>
    seq(
      alias("text", $.identifier),
      optional(seq("=", choice($.string, alias($.identifier, $.keyword)))),
    ),

  _statement_gfx_color: ($) =>
    seq(
      alias("color", $.identifier),
      optional(seq("=", "{", $.number, $.number, $.number, "}")),
    ),

  _statement_gfx_colortwo: ($) =>
    seq(
      alias("colortwo", $.identifier),
      optional(seq("=", "{", $.number, $.number, $.number, "}")),
    ),

  _statement_gfx_font: ($) =>
    seq(alias("font", $.identifier), optional(seq("=", $.string))),

  _statement_gfx_position: ($) =>
    seq(
      alias("position", $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gfx_format: ($) =>
    seq(
      alias("format", $.identifier),
      optional(
        seq("=", alias(choice("centre", "center", "left", "right"), $.keyword)),
      ),
    ),

  _statement_gfx_cull_distance: ($) =>
    seq(alias("cull_distance", $.identifier), optional(seq("=", $.number))),

  _statement_gfx_textcolors: ($) =>
    seq(
      alias(/[A-Za-z]/, $.identifier),
      optional(seq("=", "{", $.byte, $.byte, $.byte, "}")),
    ),

  _statement_gfx_bitmapfont_color: ($) =>
    seq(alias("color", $.identifier), optional(seq("=", $.hexadecimal))),

  _statement_gfx_bitmapfont_border_color: ($) =>
    seq(alias("border_color", $.identifier), optional(seq("=", $.hexadecimal))),

  _statement_gfx_animation_rate_fps: ($) =>
    seq(
      alias("animation_rate_fps", $.identifier),
      optional(seq("=", $.integer)),
    ),

  _statement_gfx_looping: ($) =>
    seq(alias("looping", $.identifier), optional(seq("=", $.bool))),

  _statement_gfx_play_on_show: ($) =>
    seq(alias("play_on_show", $.identifier), optional(seq("=", $.bool))),

  _statement_gfx_pause_on_loop: ($) =>
    seq(alias("pause_on_loop", $.identifier), optional(seq("=", $.number))),

  _statement_gfx_horizontal: ($) =>
    seq(alias("horizontal", $.identifier), optional(seq("=", $.bool))),

  _statement_gfx_file: ($) =>
    seq(
      alias("file", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".mesh", '"')), $.string)),
      ),
    ),

  _statement_gfx_pdxmesh_animation: ($) =>
    seq(
      alias("animation", $.identifier),
      optional(
        seq(
          "=",
          "{",
          $._statement_gfx_animation_id,
          $._statement_gfx_animation_type,
          "}",
        ),
      ),
    ),

  _statement_gfx_animation_id: ($) =>
    seq(alias("id", $.identifier), optional(seq("=", $.string))),

  _statement_gfx_animation_type: ($) =>
    seq(alias("type", $.identifier), optional(seq("=", $.string))),

  _statement_gfx_pdxmesh_meshsettings: ($) =>
    seq(
      alias("meshsettings", $.identifier),
      optional(
        seq(
          "=",
          "{",
          $._statement_gfx_name,
          $._statement_gfx_meshsettings_index,
          $._statement_gfx_meshsettings_texture_diffuse,
          $._statement_gfx_meshsettings_texture_normal,
          $._statement_gfx_meshsettings_texture_specular,
          $._statement_gfx_meshsettings_shader,
          $._statement_gfx_meshsettings_shader_file,
          "}",
        ),
      ),
    ),

  _statement_gfx_meshsettings_index: ($) =>
    seq(alias("index", $.identifier), optional(seq("=", $.integer))),

  _statement_gfx_meshsettings_texture_diffuse: ($) =>
    seq(
      alias("texture_diffuse", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".dds", '"')), $.string)),
      ),
    ),

  _statement_gfx_meshsettings_texture_normal: ($) =>
    seq(
      alias("texture_normal", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".dds", '"')), $.string)),
      ),
    ),

  _statement_gfx_meshsettings_texture_specular: ($) =>
    seq(
      alias("texture_specular", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".dds", '"')), $.string)),
      ),
    ),

  _statement_gfx_meshsettings_shader: ($) =>
    seq(
      alias("shader", $.identifier),
      optional(
        seq("=", alias(token(seq('"', "PdxMeshStandard", '"')), $.string)),
      ),
    ),

  _statement_gfx_meshsettings_shader_file: ($) =>
    seq(
      alias("shader_file", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".shader", '"')), $.string)),
      ),
    ),

  _statement_gfx_scale: ($) =>
    seq(
      alias("scale", $.identifier),
      optional(seq("=", choice($.number, $.string))),
    ),

  _statement_gfx_transparencecheck: ($) =>
    seq(alias("transparencecheck", $.identifier), optional(seq("=", $.bool))),

  _statement_gfx_loadType: ($) =>
    seq(
      alias("loadType", $.identifier),
      optional(seq("=", alias(choice('"INGAME"', '"FRONTEND"'), $.string))),
    ),

  _statement_gfx_norefcount: ($) =>
    seq(alias("norefcount", $.identifier), optional(seq("=", $.bool))),

  _statement_gfx_texture: ($) =>
    seq(
      alias("texture", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".dds", '"')), $.string)),
      ),
    ),

  _statement_gfx_normal: ($) =>
    seq(
      alias("normal", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".dds", '"')), $.string)),
      ),
    ),

  _statement_gfx_specular: ($) =>
    seq(
      alias("specular", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".dds", '"')), $.string)),
      ),
    ),

  _statement_gfx_effect: ($) =>
    seq(
      alias("effect", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".lua", '"')), $.string)),
      ),
    ),

  _statement_gfx_effect_bool: ($) =>
    seq(alias("effect", $.identifier), optional(seq("=", $.bool))),

  _statement_gfx_alphamaskfile: ($) =>
    seq(
      alias("alphamaskfile", $.identifier),
      optional(
        seq("=", alias(token(seq('"', /[^\"\n]+/, ".tga", '"')), $.string)),
      ),
    ),

  _statement_gfx_linewidth: ($) =>
    seq(alias("linewidth", $.identifier), optional(seq("=", $.integer))),

  _statement_gfx_type: ($) =>
    seq(alias("type", $.identifier), optional(seq("=", $.string))),

  //-------------------------------------//
  //  GUI statements [_statement_gui_X]  //
  //-------------------------------------//

  _statement_gui_background: ($) =>
    seq(alias(/back[Gg]round/, $.identifier), optional(seq("=", $.string))),

  _statement_gui_position: ($) =>
    seq(
      alias("position", $.identifier),
      optional(seq(optional("="), "{", $._statement_xy_integer, "}")),
    ),

  _statement_gui_size: ($) =>
    seq(
      alias("size", $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gui_size_width_height: ($) =>
    seq(
      alias("size", $.identifier),
      optional(seq("=", "{", $._statement_width_height_integer, "}")),
    ),

  _statement_gui_borderSize: ($) =>
    seq(
      alias(/border[Ss]ize/, $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gui_moveable: ($) =>
    seq(
      alias(/move?able/, $.identifier),
      optional(seq("=", choice($._bool_0_1, $.bool))),
    ),

  _statement_gui_orientation: ($) =>
    seq(
      alias(/[Oo]rientation/, $.identifier),
      optional(
        seq(
          "=",
          choice($._orientation_value_string, $._orientation_value_keyword),
        ),
      ),
    ),

  _statement_gui_priority: ($) =>
    seq(alias("priority", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_scrollbartype: ($) =>
    seq(alias("scrollbartype", $.identifier), optional(seq("=", $.string))),

  _statement_gui_alwaystransparent: ($) =>
    seq(
      alias(/all?ways[Tt]ransparent/, $.identifier),
      optional(seq("=", $.bool)),
    ),

  _statement_gui_textureFile: ($) =>
    seq(
      alias("textureFile", $.identifier),
      optional(
        seq(
          "=",
          alias(
            token(
              seq('"', optional(seq(/[^\"\n]+/, choice(".dds", ".tga"))), '"'),
            ),
            $.string,
          ),
        ),
      ),
    ),

  _statement_gui_font: ($) =>
    seq(alias("font", $.identifier), optional(seq("=", $.string))),

  _statement_gui_cursor: ($) =>
    seq(
      alias("cursor", $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gui_text: ($) =>
    seq(
      alias("text", $.identifier),
      optional(seq("=", choice($.string, alias($.identifier, $.keyword)))),
    ),

  _statement_gui_instantTextBoxType: ($) =>
    seq(alias("instantTextBoxType", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_maxWidth: ($) =>
    seq(alias(/max[Ww]idth/, $.identifier), optional(seq("=", $.integer))),

  _statement_gui_maxHeight: ($) =>
    seq(alias(/max[Hh]eight/, $.identifier), optional(seq("=", $.integer))),

  _statement_gui_min_height: ($) =>
    seq(alias("min_height", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_max_height: ($) =>
    seq(alias("max_height", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_fixedsize: ($) =>
    seq(alias("fixedsize", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_spriteType: ($) =>
    seq(
      alias(/[Ss]priteType/, $.identifier),
      optional(seq("=", choice($.string, $.identifier))),
    ),

  _statement_gui_format: ($) =>
    seq(
      alias("format", $.identifier),
      optional(
        seq(
          "=",
          alias(
            choice(
              "centre",
              "center",
              "left",
              "right",
              '"UPPER_LEFT"', //// TODO: Verify validity and extend
            ),
            $.keyword,
          ),
        ),
      ),
    ),

  _statement_gui_truncate: ($) =>
    seq(alias("truncate", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_slider: ($) =>
    seq(alias("slider", $.identifier), optional(seq("=", $.string))),

  _statement_gui_track: ($) =>
    seq(alias("track", $.identifier), optional(seq("=", $.string))),

  _statement_gui_leftbutton: ($) =>
    seq(alias("leftbutton", $.identifier), optional(seq("=", $.string))),

  _statement_gui_rightbutton: ($) =>
    seq(alias("rightbutton", $.identifier), optional(seq("=", $.string))),

  _statement_gui_maxValue: ($) =>
    seq(alias("maxValue", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_minValue: ($) =>
    seq(alias("minValue", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_stepSize: ($) =>
    seq(alias("stepSize", $.identifier), optional(seq("=", $.number))),

  _statement_gui_startValue: ($) =>
    seq(alias("startValue", $.identifier), optional(seq("=", $.number))),

  _statement_gui_horizontal: ($) =>
    seq(alias("horizontal", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_horizontal_bool: ($) =>
    seq(alias("horizontal", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_quadTextureSprite: ($) =>
    seq(alias("quadTextureSprite", $.identifier), optional(seq("=", $.string))),

  _statement_gui_parent: ($) =>
    seq(alias("parent", $.identifier), optional(seq("=", $.string))),

  _statement_gui_scroll_speed: ($) =>
    seq(alias("scroll_speed", $.identifier), optional(seq("=", $.number))),

  _statement_gui_tooltip: ($) =>
    seq(alias("tooltip", $.identifier), optional(seq("=", $.string))),

  _statement_gui_tooltipText: ($) =>
    seq(alias("tooltipText", $.identifier), optional(seq("=", $.string))),

  _statement_gui_delayedTooltipText: ($) =>
    seq(
      alias("delayedTooltipText", $.identifier),
      optional(seq("=", $.string)),
    ),

  _statement_gui_pdx_tooltip: ($) =>
    seq(alias("pdx_tooltip", $.identifier), optional(seq("=", $.string))),

  _statement_gui_pdx_tooltip_delayed: ($) =>
    seq(
      alias("pdx_tooltip_delayed", $.identifier),
      optional(seq("=", $.string)),
    ),

  _statement_gui_dontRender: ($) =>
    seq(alias("dontRender", $.identifier), optional(seq("=", $.string))),

  _statement_gui_horizontalBorder: ($) =>
    seq(alias("horizontalBorder", $.identifier), optional(seq("=", $.string))),

  _statement_gui_verticalBorder: ($) =>
    seq(alias("verticalBorder", $.identifier), optional(seq("=", $.string))),

  _statement_gui_fullScreen: ($) =>
    seq(alias(/full[Ss]creen/, $.identifier), optional(seq("=", $.bool))),

  _statement_gui_spacing: ($) =>
    seq(alias("spacing", $.identifier), optional(seq("=", $.number))),

  _statement_gui_buttonText: ($) =>
    seq(alias("buttonText", $.identifier), optional(seq("=", $.string))),

  _statement_gui_buttonFont: ($) =>
    seq(alias("buttonFont", $.identifier), optional(seq("=", $.string))),

  _statement_gui_shortcut: ($) =>
    seq(alias(/short[Cc]ut/, $.identifier), optional(seq("=", $.string))),

  _statement_gui_extra_shortcut: ($) =>
    seq(alias("extra_shortcut", $.identifier), optional(seq("=", $.string))),

  _statement_gui_fixedsize: ($) =>
    seq(alias("fixedsize", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_upsound: ($) =>
    seq(
      alias("upsound", $.identifier),
      optional(seq("=", choice($.string, alias($.identifier, $.keyword)))),
    ),

  _statement_gui_downsound: ($) =>
    seq(
      alias("downsound", $.identifier),
      optional(seq("=", choice($.string, alias($.identifier, $.keyword)))),
    ),

  _statement_gui_frame: ($) =>
    seq(alias("frame", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_hint_tag: ($) =>
    seq(alias("hint_tag", $.identifier), optional(seq("=", $.string))),

  _statement_gui_clicksound: ($) =>
    seq(
      alias("clicksound", $.identifier),
      optional(seq("=", choice(alias($.identifier, $.keyword), $.string))),
    ),

  _statement_gui_no_clicksound: ($) =>
    seq(alias("no_clicksound", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_ignore_tab_navigation: ($) =>
    seq(
      alias("ignore_tab_navigation", $.identifier),
      optional(seq("=", $.bool)),
    ),

  _statement_gui_show_position: ($) =>
    seq(
      alias("show_position", $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gui_hide_position: ($) =>
    seq(
      alias("hide_position", $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gui_animation_type: ($) =>
    seq(
      alias("animation_type", $.identifier),
      optional(
        seq(
          "=",
          alias(choice('"decelerated"', '"accelerated"', '"linear"'), $.string),
        ),
      ),
    ),

  _statement_gui_animation_time: ($) =>
    seq(alias("animation_time", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_scale: ($) =>
    seq(
      alias("scale", $.identifier),
      optional(seq("=", choice($.string, $.number))),
    ),

  _statement_gui_rotation: ($) =>
    seq(alias("rotation", $.identifier), optional(seq("=", $.number))),

  _statement_gui_offset: ($) =>
    seq(
      alias("offset", $.identifier),
      optional(seq("=", "{", $._statement_xy_integer, "}")),
    ),

  _statement_gui_slotsize: ($) =>
    seq(
      alias("slotsize", $.identifier),
      optional(seq("=", "{", $._statement_width_height_integer, "}")),
    ),

  _statement_gui_max_slots_horizontal: ($) =>
    seq(
      alias("max_slots_horizontal", $.identifier),
      optional(seq("=", $.integer)),
    ),

  _statement_gui_max_slots_vertical: ($) =>
    seq(
      alias("max_slots_vertical", $.identifier),
      optional(seq("=", $.integer)),
    ),

  _statement_gui_buttonMesh: ($) =>
    seq(alias("buttonMesh", $.identifier), optional(seq("=", $.string))),

  _statement_gui_click_to_front: ($) =>
    seq(alias("click_to_front", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_use_special_chars: ($) =>
    seq(alias("use_special_chars", $.identifier), optional(seq("=", $.bool))),

  _statement_gui_web_link: ($) =>
    seq(
      alias("web_link", $.identifier),
      optional(
        seq(
          "=",
          alias(token(seq('"', /https?:\/\//, /[^\"\n]+/, '"')), $.string),
        ),
      ),
    ),

  _statement_gui_step: ($) =>
    seq(
      alias("step", $.identifier),
      optional(
        seq(
          "=",
          $.integer, // Maybe boolean 1 0
        ),
      ),
    ),

  _statement_gui_show_animation_type: ($) =>
    seq(
      alias("show_animation_type", $.identifier),
      optional(
        seq("=", alias(choice("decelerated", "accelerated"), $.keyword)),
      ),
    ),

  _statement_gui_hide_animation_type: ($) =>
    seq(
      alias("hide_animation_type", $.identifier),
      optional(
        seq("=", alias(choice("decelerated", "accelerated"), $.keyword)),
      ),
    ),

  _statement_gui_origo: ($) =>
    seq(
      alias("origo", $.identifier),
      optional(seq("=", alias(choice("center", "left", "right"), $.keyword))),
    ),

  _statement_gui_fade_time: ($) =>
    seq(alias("fade_time", $.identifier), optional(seq("=", $.integer))),

  _statement_gui_fade_type: ($) =>
    seq(
      alias("fade_type", $.identifier),
      optional(seq("=", alias(choice("linear"), $.keyword))),
    ),

  _statement_gui_margin: ($) =>
    seq(
      alias("margin", $.identifier),
      optional(seq("=", "{", $._statement_margin_integer, "}")),
    ),

  _statement_gui_tileSize: ($) =>
    seq(
      alias("tileSize", $.identifier),
      optional(
        seq(
          "=",
          "{",
          repeat1(choice($._entry_width_integer, $._entry_height_integer)),
          "}",
        ),
      ),
    ),

  _statement_gui_verticalScrollbar: ($) =>
    seq(alias("verticalScrollbar", $.identifier), optional(seq("=", $.string))),

  _statement_gui_text_color_code: ($) =>
    seq(
      alias("text_color_code", $.identifier),
      optional(seq("=", alias(/"[A-Za-z]"/, $.string))),
    ),

  _statement_gui_scrollbar_side: ($) =>
    seq(
      alias("scrollbar_side", $.identifier),
      optional(seq("=", alias(choice("LEFT", "RIGHT"), $.keyword))),
    ),

  //==============================//
  //            TOKENS            //
  //==============================//

  // identifier: ($) => /[a-zA-Z0-9_]+/,

  // assign_equal: ($) => "=",

  // assign_colon: ($) => token.immediate(":"),

  // string: ($) => /"[^\"\n]*"/,

  // number: ($) =>
  //   token(seq(optional("-"), /\d+/, optional(/\.\d+/), optional("f"))),

  // float: ($) =>
  //   token(seq(optional("-"), /\d+/, optional(seq(".", /\d+/)), optional("f"))),

  // _float_positive: ($) =>
  //   alias(token(seq(/\d+/, optional(seq(".", /\d+/)), optional("f"))), $.float),

  // integer: ($) => token(seq(optional("-"), /\d+/)),

  // _integer_positive: ($) => alias(/\d+/, $.integer),

  byte: ($) => /[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]/,

  hexadecimal: ($) => token(seq("0x", choice(/[0-9a-f]{4}/, /[0-9a-f]{8}/))),

  angle: ($) =>
    /36[0]\.0|3[0-5][0-9]\.[0-9]|[12][0-9][0-9]\.[0-9]|[1-9]?[0-9]\.[0-9]/,

  // boolean: ($) => choice("true", "false"),

  // _boolean_yes_no: ($) => alias(choice("yes", "no"), $.boolean),

  // _boolean_0_1: ($) => alias(choice("0", "1"), $.boolean),

  // comment: ($) => token(prec(-1, /#[^\n]*/)),

  _orientation_value_string: ($) =>
    alias(
      token(
        seq(
          '"',
          choice(
            "LEFT",
            "left",
            "RIGHT",
            "right",
            "CENTER",
            "center",
            "CENTER_UP",
            "center_up",
            "CENTER_DOWN",
            "center_down",
            "CENTER_LEFT",
            "center_left",
            "CENTER_RIGHT",
            "center_right",
            "UPPER_LEFT",
            "upper_left",
            "UPPER_RIGHT",
            "upper_right",
            "LOWER_LEFT",
            "lower_left",
            "LOWER_RIGHT",
            "lower_right", //// TODO: Complete
          ),
          '"',
        ),
      ),
      $.string,
    ),

  _orientation_value_keyword: ($) =>
    alias(
      token(
        choice(
          "LEFT",
          "left",
          "RIGHT",
          "right",
          "CENTER",
          "center",
          "CENTER_UP",
          "center_up",
          "CENTER_DOWN",
          "center_down",
          "CENTER_LEFT",
          "center_left",
          "CENTER_RIGHT",
          "center_right",
          "UPPER_LEFT",
          "upper_left",
          "UPPER_RIGHT",
          "upper_right",
          "LOWER_LEFT",
          "lower_left",
          "LOWER_RIGHT",
          "lower_right", //// TODO: Complete
        ),
      ),
      $.keyword,
    ),

  // _eol: ($) => token(/\r?\n/),

  // debug: ($) => /.+/,
};
