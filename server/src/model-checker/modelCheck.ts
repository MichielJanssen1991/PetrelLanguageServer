import * as LSP from 'vscode-languageserver';
import { DiagnosticsCollection } from '../generic/diagnosticsCollection';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';
import { ModelDetailLevel, ModelElementTypes, TreeNode } from '../model-definition/symbolsAndReferences';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';
import { ModelCheckerOptions } from './modelChecker';

export abstract class ModelCheck extends DiagnosticsCollection {
	protected modelManager: ModelManager;
	protected modelDefinitionManager: ModelDefinitionManager;
	//Applicablility of the check is determined by the below conditions
	protected abstract modelElementType: ModelElementTypes;
	protected abstract detailLevel: ModelDetailLevel;
	protected abstract matchCondition?: (node: TreeNode) => boolean;

	constructor(modelManager: ModelManager, modelDefinitionManager? : ModelDefinitionManager) {
		super();
		this.modelManager = modelManager;
		this.modelDefinitionManager = modelDefinitionManager || new ModelDefinitionManager();
	}

	public check(node: TreeNode, options: ModelCheckerOptions): LSP.Diagnostic[] {
		this.clearDiagnostics();
		this.checkInternal(node, options);
		return this.getDiagnostics();
	}

	public isApplicable(node: TreeNode, options: ModelCheckerOptions): boolean {
		let isApplicable = (node.type == this.modelElementType || this.modelElementType == ModelElementTypes.All);
		isApplicable = isApplicable && (this.matchCondition ? this.matchCondition(node) : true);
		isApplicable = isApplicable && (options.detailLevel >= this.detailLevel);
		return isApplicable;
	}

	protected abstract checkInternal(node: TreeNode, options: ModelCheckerOptions): void
}