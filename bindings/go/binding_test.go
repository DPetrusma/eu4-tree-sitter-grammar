package tree_sitter_eu4mod_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_eu4mod "github.com/tree-sitter/tree-sitter-eu4mod/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_eu4mod.Language())
	if language == nil {
		t.Errorf("Error loading EU4 Modding grammar")
	}
}
