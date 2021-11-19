import * as LSP from 'vscode-languageserver';
import { ModelDetailLevel, ModelElementTypes, newSymbolDeclaration, Reference, SymbolDeclaration } from '../../model-definition/symbolsAndReferences';
import { FileParser } from './fileParser';

export class JavascriptParser extends FileParser {
	private static MESSAGES = {
		THIRD_ARGUMENT_NOT_STRING: "The third argument of initAction is not empty but not a string. Resolving the variable is not implemented.",
		SECOND_ARGUMENT_NOT_STRING: "The second argument of LayoutActionBase.init is not a string. Resolving the variable is not implemented."
	}

	constructor(uri: string) {
		super(uri, ModelDetailLevel.Declarations);
		this.uri = uri;
	}

	public parseFile(fileContent: string) {
		const regexpInitFrontendAction = /(initAction\()(?<firstArgument>([\w._])+)(,([\n\t ]*)(?<secondArgument>(\w)+))?(,([\n\t ]*)(?<thirdArgument>([\w._"'])+))?/g;
		const matches = [...fileContent.matchAll(regexpInitFrontendAction)];
		console.log(matches);
		matches.forEach((match) => {
			const range = this.indexStartAndEndToRange(fileContent, match.index || 0, match.index || 0 + match.length + 1);

			if (match?.groups) {
				const { thirdArgument, firstArgument } = match.groups;
				if (thirdArgument) {
					if (isStringArgument(thirdArgument)) {
						this.addAction(stringArgumentValue(thirdArgument), range);
					}
					else {
						this.addWarning(range, JavascriptParser.MESSAGES.THIRD_ARGUMENT_NOT_STRING);
					}
				} else {
					this.addAction(firstArgument, range);
				}
			}
		});

		const regexpInitFrontendLayoutAction = /(LayoutActionBase.init\()(?<firstArgument>([\w._])+)(,([\n\t ]*)(?<secondArgument>([\w._"'])+))?/g;
		const matchesLayoutActions = [...fileContent.matchAll(regexpInitFrontendLayoutAction)];
		console.log(matchesLayoutActions);
		matchesLayoutActions.forEach((matchesLayoutActions) => {
			const range = this.indexStartAndEndToRange(fileContent, matchesLayoutActions.index || 0, matchesLayoutActions.index || 0 + 8);

			if (matchesLayoutActions?.groups) {
				const { secondArgument, firstArgument } = matchesLayoutActions.groups;
				if (secondArgument) {
					if (isStringArgument(secondArgument)) {
						this.addAction(stringArgumentValue(secondArgument), range);
					}
					else {
						this.addWarning(range, JavascriptParser.MESSAGES.SECOND_ARGUMENT_NOT_STRING);
					}
				} else {
					this.addAction(firstArgument, range);
				}
			}
		});

		return this.getResults();

		function stringArgumentValue(argument: string): any {
			return argument.replace(/['"]$/, "").replace(/^['"]/, "");
		}

		function isStringArgument(argument: string) {
			return argument.startsWith("\"") || argument.startsWith("'")
				&& argument.endsWith("\"") || argument.endsWith("'");
		}
	}

	private addAction(actionName: any, range: LSP.Range) {
		actionName = removeActionPostfix(actionName);
		const symbol = newSymbolDeclaration(actionName, "", ModelElementTypes.Action, range, this.uri, false);
		this.addSymbolDeclaration(symbol);

		function removeActionPostfix(actionName: string): any {
			return actionName.replace(/(Action)$/, "").replace(/(action)$/, "");
		}


		return actionName;
	}

	public getResults() {
		return this.results;
	}

	private addSymbolDeclaration(symbol: SymbolDeclaration) {
		this.results.tree.children.push(symbol);
	}

	private indexStartAndEndToRange(data: string, indexStart: number, indexEnd: number) {
		const startPos = this.indexToLineAndCharacter(data, indexStart);
		const endPos = this.indexToLineAndCharacter(data, indexEnd);


		return LSP.Range.create(
			startPos.line,
			startPos.character,
			endPos.line,
			endPos.character,
		);
	}
	private indexToLineAndCharacter(data: string, index: number) {
		const perLine = data.split('\n');
		let total_length = 0;
		let line = 0;
		for (let i = 0; i < perLine.length; i++) {
			total_length += perLine[i].length + 2;
			if (total_length >= index) {
				line = i + 1;
				break;
			}
		}
		let character = total_length - index + 1;
		if (character < 0) {
			character = 0;
		}
		return { line: line, character: character };
	}
}