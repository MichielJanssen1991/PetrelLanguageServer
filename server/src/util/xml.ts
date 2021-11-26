import { TextDocument } from 'vscode-languageserver-textdocument';
import { integer, Position } from 'vscode-languageserver-types';
import { ModelParser } from '../file-analyzer/parser/modelParser';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';
import { ModelDetailLevel, ModelElementTypes } from '../model-definition/symbolsAndReferences';
const MAXLINESIZE = 500;

export type attributeLocation = {
	name : string,
	value? : string,
	start : integer,
	length : integer,
	match : boolean
}

export type RuleContext = {
	name : string,
	availableParams: string[],//ParamRuleContext[]
	start : integer,
	length : integer
}

export type ParamRuleContext = {
	type: [ModelElementTypes.Input, ModelElementTypes.Output, ModelElementTypes.SetVar],
	name?: string,
	localName?: string,
	remoteName?: string,
	value?: string
}

export function getContextFromLine(textDocument: TextDocument, pos: Position) {
	const lineText = textDocument.getText({
		start: { line: pos.line, character: 0 },
		end: { line: pos.line, character: MAXLINESIZE }
	});
	const lineTextBeforeCurrentPoint = lineText.slice(0, pos.character);
	const countNumberOfOpeningParenthesis = lineTextBeforeCurrentPoint.split("\"").length - 1;
	const inAttribute = countNumberOfOpeningParenthesis % 2 === 1;

	return inAttribute;
}

export function wordAtPoint(textDocument: TextDocument, pos: Position):string {
	const lineText = textDocument.getText({
		start: { line: pos.line, character: 0 },
		end: { line: pos.line, character: MAXLINESIZE }
	});

	const words = lineText.split(new RegExp("[^\\w-.]"));
	const word = words.reduce((result: any, item: string, index: number) => {
		if (result.pos <= pos.character) {
			result.pos += item.length + 1;
			result.word = item;
		}
		return result;
	}, { pos: 0, word: "" }).word;
	return word;
}

export function attributesAtPoint(textDocument: TextDocument, pos: Position) : attributeLocation[] {
	const lineText = textDocument.getText({
		start: { line: pos.line, character: 0 },
		end: { line: pos.line, character: MAXLINESIZE }
	});

	const regEx = new RegExp(/(\S+)=["']+([\w\.]*)["']+/g);

	let attributes = [];
	let res;
	while (null !== (res = regEx.exec(lineText))) {
		const start : integer = lineText.indexOf(res[0]);
		const length : integer = res[0].length;
		const name : string = res[1];
		const value : string = res[2];
		const match : boolean = (start < pos.character && (start+length) > pos.character);
		attributes.push({start, length, name, value, match});
	}
	return attributes;
}

export function getRuleContextAtPoint(textDocument: TextDocument, pos: Position, offsetStart: integer = 20, offsetEnd: integer = 20) : RuleContext{
	const start : integer = (pos.line-offsetStart) > 0 ? pos.line-offsetStart : 0;
	const end : integer = (pos.line+offsetEnd) <= textDocument.lineCount ? pos.line+offsetEnd : textDocument.lineCount;

	const selectedText = textDocument.getText({
		start: { line: start, character: 0 },
		end: { line: end, character: MAXLINESIZE }
	});

	const currentLineString = textDocument.getText({ start: { line: pos.line, character: 0}, end: { line: pos.line, character: MAXLINESIZE}}).replace(/[\t\n]/, "");
	const currentLinePosition = selectedText.indexOf(currentLineString);

	let res;
	let posStart = 0;
	const regexOpeningTag = new RegExp(/<rule\s.*?>/g);
	while (null !== (res = regexOpeningTag.exec(selectedText.substr(0, currentLinePosition)))){
		if (res.index !== 0){
			posStart = res.index;
			// continue until last rule tag is found
		}
		
	}
	let posEnd = 0;
	const regexClosingTag = new RegExp(/<\/rule[\s\t]*?>/g);
	while (null !== (res = regexClosingTag.exec(selectedText.substr(currentLinePosition)))){
		if (res.index !== 0){
			posEnd = currentLinePosition+res.index+res[0].length;
			break;
			// first match only 
		}	
	}

	if ((posStart == 0 || posEnd == 0) && (textDocument.lineCount > end || start > 0)){
		offsetStart = posStart == 0 ? offsetStart + 20 : offsetStart;
		offsetEnd = posEnd == 0 ? offsetEnd + 20 : offsetEnd;
		return getRuleContextAtPoint(textDocument, pos, offsetStart, offsetEnd);
	}

	let params : string [] = [];
	let rulename = "";
	if (posStart > 0 && posEnd > 0){
		const mp = new ModelParser("", ModelDetailLevel.All, new ModelDefinitionManager());
		const parsedRule = mp.parseFile(selectedText.substr(posStart, (posEnd - posStart)));
		
		const ruleDefinition = parsedRule.tree.children[0];
		rulename = ruleDefinition.name;
		params = findNames(ruleDefinition.children, [ModelElementTypes.Output, ModelElementTypes.Input, ModelElementTypes.SetVar] );
	}

	return { name: rulename, availableParams: params, start: posStart, length: posEnd-posStart };
}

export function findNames(children : any[], matchTags : ModelElementTypes[]) : string[]{
	let names : string [] = [];
	children.forEach(child => {
		if (matchTags.map(tag=>tag.toLowerCase()).includes(child.tag)){
			names.push(child.name);
		}		
		if (child.children && child.children.length > 0) {
			names = names.concat(findNames(child.children, matchTags));
		}
	});
	return names;
}



