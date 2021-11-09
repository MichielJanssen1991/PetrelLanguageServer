import * as LSP from 'vscode-languageserver';
import { ModelElementTypes, ObjectIdentifierTypes, Reference, SymbolDeclaration } from '../model-definition/symbolsAndReferences';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';
import { ModelCheckerOptions } from './modelChecker';

export abstract class ModelCheck {
	private diagnostics: LSP.Diagnostic[] = [];
	protected modelManager: ModelManager;
	protected abstract objectType: ObjectIdentifierTypes;
	protected abstract modelElementType: ModelElementTypes

	constructor(modelManager: ModelManager) {
		this.modelManager = modelManager;
	}

	public check(node: SymbolDeclaration | Reference, options: ModelCheckerOptions): LSP.Diagnostic[] {
		this.diagnostics = [];
		this.checkInternal(node, options);
		return this.diagnostics;
	}

	public isApplicable(node:SymbolDeclaration | Reference):boolean
	{
		const modelElementTypeIsApplicable = node.type == this.modelElementType || this.modelElementType == ModelElementTypes.All;
		const objectIdentifierTypeIsApplicable = node.objectType == this.objectType;
		return modelElementTypeIsApplicable && objectIdentifierTypeIsApplicable;
	}

	protected abstract checkInternal(node: SymbolDeclaration | Reference, options: ModelCheckerOptions): void

	protected addInformation(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Information);
	}
	protected addWarning(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Warning);
	}
	protected addError(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Error);
	}
	protected addDiagnostics(range: LSP.Range, message: string, severity: LSP.DiagnosticSeverity) {
		this.diagnostics.push(
			LSP.Diagnostic.create(range, message, severity)
		);
	}
}