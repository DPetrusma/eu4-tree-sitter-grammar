import XCTest
import SwiftTreeSitter
import TreeSitterEu4mod

final class TreeSitterEu4modTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_eu4mod())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading EU4 Modding grammar")
    }
}
