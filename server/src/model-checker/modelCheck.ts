import * as LSP from 'vscode-languageserver';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';
import { ModelDetailLevel, ModelElementTypes, TreeNode } from '../model-definition/symbolsAndReferences';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';
import { ModelCheckerOptions } from './modelChecker';

export abstract class ModelCheck {
	private diagnostics: LSP.Diagnostic[] = [];
	protected modelManager: ModelManager;
	protected modelDefinitionManager: ModelDefinitionManager;
	//Applicablility of the check is determined by the below conditions
	protected abstract modelElementType: ModelElementTypes;
	protected abstract detailLevel: ModelDetailLevel;
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

	public isApplicable(node: TreeNode, options: ModelCheckerOptions): boolean {
		let isApplicable = (node.type == this.modelElementType || this.modelElementType == ModelElementTypes.All);
		isApplicable = isApplicable && (this.matchCondition ? this.matchCondition(node) : true);
		isApplicable = isApplicable && (options.detailLevel >= this.detailLevel);
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