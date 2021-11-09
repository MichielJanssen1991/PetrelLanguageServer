import * as LSP from 'vscode-languageserver';
import { ModelElementTypes, ObjectIdentifierTypes, Reference, SymbolDeclaration, SymbolOrReference } from '../model-definition/symbolsAndReferences';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';
import { ModelCheckerOptions } from './modelChecker';

export abstract class ModelCheck {
	private diagnostics: LSP.Diagnostic[] = [];
	protected modelManager: ModelManager;
	protected abstract objectType: ObjectIdentifierTypes;
	protected abstract modelElementType: ModelElementTypes;
	protected abstract matchCondition?: (node: SymbolOrReference) => boolean;

	constructor(modelManager: ModelManager) {
		this.modelManager = modelManager;
	}

	public check(node: SymbolOrReference, options: ModelCheckerOptions): LSP.Diagnostic[] {
		this.diagnostics = [];
		this.checkInternal(node, options);
		return this.diagnostics;
	}

	public isApplicable(node: SymbolOrReference): boolean {
		const modelElementTypeIsApplicable = node.type == this.modelElementType || this.modelElementType == ModelElementTypes.All;
		const objectIdentifierTypeIsApplicable = node.objectType == this.objectType;
		const condition = this.matchCondition?this.matchCondition(node):true;
		return modelElementTypeIsApplicable && objectIdentifierTypeIsApplicable && condition;
	}

	protected abstract checkInternal(node: SymbolOrReference, options: ModelCheckerOptions): void

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