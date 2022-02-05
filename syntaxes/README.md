# Petrel language syntax
The syntax is defined as a TextMate language grammar. The conventions are followed as described on:
https://macromates.com/manual/en/language_grammars
The syntax is basically describing xml with colors for specific tags in the petrel xml language.

The relevant conventions used in this syntax are:
- entity.name.tag — a tag name. Matches for a tagname. For example TAGNAME in <TAGNAME .../>
- meta.tag.block — the meta scope is generally used to markup larger parts of the document. The meta.tag.block is used to match the whole tag block. For example the whole tag including attributes <TAGNAME .../>
Additionally, the identifier punctuation is used to specify symbols such as quotes "" or other symbols;
- punctuation.seperator — seperates definitions such as = and has the form LEFTSIDE-RIGHTSIDE for example key-value
- punctuation.definition — part of a definition such as "" for a string or <> symbols for tags
Furthermore each definition is postfixed with .petrel.