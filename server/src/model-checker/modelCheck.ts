import * as LSP from 'vscode-languageserver';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';
import { ModelElementTypes, TreeNode } from '../model-definition/symbolsAndReferences';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';
import { ModelCheckerOptions } from './modelChecker';

export abstract class ModelCheck {
	private diagnostics: LSP.Diagnostic[] = [];
	protected modelManager: ModelManager;
	protected modelDefinitionManager: ModelDefinitionManager;
	protected abstract modelElementType: ModelElementTypes;
	protected abstract matchCondition?: (node: TreeNode) => boolean;

	constructor(modelManager: ModelManager, modelDefinitionManager? : ModelDefinitionManager) {
		this.modelManager = modelManager;
		this.modelDefinitionManager = modelDefinitionManager || new ModelDefinitionManager();
	}

	public check(node: TreeNode, options: ModelCheckerOptions): LSP.Diagnostic[] {
		this.diagnostics = [];
		this.checkInternal(node, options);
		return this.diagnostics;
	}

	public isApplicable(node: TreeNode): boolean {
		const isApplicable = (node?.type == this.modelElementType || this.modelElementType == ModelElementTypes.All)
			&& (this.matchCondition ? this.matchCondition(node) : true);
		return isApplicable;
	}

	protected abstract checkInternal(node: TreeNode, options: ModelCheckerOptions): void

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