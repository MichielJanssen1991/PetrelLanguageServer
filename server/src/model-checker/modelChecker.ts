import * as LSP from 'vscode-languageserver';
import { ModelDetailLevel, SymbolDeclaration, TreeNode } from '../model-definition/symbolsAndReferences';
import { removeFilesFromDirectories } from '../util/fs';
import { ModelCheck } from './modelCheck';
import { InfosetDeclarationCheck } from './checks/infosetDeclarationCheck';
import { ReferencedObjectExistsCheck } from './checks/referencedObjectExistsCheck';
import { SymbolIsReferencedCheck } from './checks/symbolIsReferencedCheck';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from './messages';
import { DataActionCallCheck } from './checks/actionCallChecks/dataActionCallCheck';
import { InfosetCallCheck } from './checks/actionCallChecks/infosetCallCheck';
import { RuleCallCheck } from './checks/actionCallChecks/ruleCallCheck';
import { RuleLoopActionCallCheck } from './checks/actionCallChecks/ruleLoopActionCallCheck';
import { FunctionCallCheck } from './checks/actionCallChecks/functionCallCheck';
import { RuleDeclarationCheck } from './checks/ruleDeclarationCheck';
import { ModelDefinitionCheck } from './checks/modelDefinitionCheck';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';

export type ModelCheckerOptions = {
	maxNumberOfProblems?: number,
	detailLevel: ModelDetailLevel,
	skipFolders: string[],
}
/**
 * The ModelChecker verifies the model and returns a list of diagnostics 
 */
export class ModelChecker {
	private diagnostics: LSP.Diagnostic[] = [];
	private modelManager: ModelManager;
	private modelDefinitionManager: ModelDefinitionManager;
	private static defaultOptions: ModelCheckerOptions = { detailLevel: ModelDetailLevel.SubReferences, skipFolders: [] };
	private checks: ModelCheck[] = [];

	constructor(modelManager: ModelManager, modelDefinitionManager: ModelDefinitionManager) {
		this.modelManager = modelManager;
		this.modelDefinitionManager = modelDefinitionManager;

		this.checks.push(new InfosetCallCheck(modelManager));
		this.checks.push(new RuleCallCheck(modelManager));
		this.checks.push(new FunctionCallCheck(modelManager));
		this.checks.push(new DataActionCallCheck(modelManager));
		this.checks.push(new RuleLoopActionCallCheck(modelManager));
		this.checks.push(new InfosetDeclarationCheck(modelManager));
		this.checks.push(new ReferencedObjectExistsCheck(modelManager));
		this.checks.push(new SymbolIsReferencedCheck(modelManager));
		this.checks.push(new ModelDefinitionCheck(modelManager, modelDefinitionManager));
		this.checks.push(new RuleDeclarationCheck(modelManager));
	}

	public checkAllFiles(options?: ModelCheckerOptions) {
		const diagnosticsPerFile: Record<string, LSP.Diagnostic[]> = {};
		let files = this.modelManager.getFiles();
		if (options?.skipFolders) {
			files = removeFilesFromDirectories(options.skipFolders, files);
		}
		let count = 0;
		for (const file of files) {
			const diagnostics = this.checkFile(file, options);
			diagnosticsPerFile[file] = diagnostics;
			count += diagnostics.length;
			if (count > (options?.maxNumberOfProblems || Infinity)) { break; }
		}

		return diagnosticsPerFile;
	}

	public checkFile(uri: string, options?: ModelCheckerOptions) {
		this.diagnostics = [];
		const optionsOrDefault: ModelCheckerOptions = options || ModelChecker.defaultOptions;

		const tree = this.modelManager.getTreeForFile(uri);
		this.walkNodes(tree, optionsOrDefault);

		return this.diagnostics;
	}

	private walkNodes(node: TreeNode, options: ModelCheckerOptions) {
		this.verifyNode(node, options);
		const isObsolete = node.contextQualifiers.isObsolete;
		if (!isObsolete) {
			node.children.forEach(x => this.walkNodes(x, options));
		}
	}

	private verifyNode(node: TreeNode, options: ModelCheckerOptions) {
		try {
			const applicableChecks = this.checks.filter(c=> c.isApplicable(node));
			this.diagnostics = this.diagnostics.concat(applicableChecks.flatMap(c=> c.check(node, options)));
		}
		catch (error: any) {
			this.addError(node.range, CHECKS_MESSAGES.VALIDATION_ERROR(error.message, node as SymbolDeclaration));
		}
	}


	private addInformation(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Information);
	}
	private addWarning(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Warning);
	}
	private addError(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Error);
	}
	private addDiagnostics(range: LSP.Range, message: string, severity: LSP.DiagnosticSeverity) {
		this.diagnostics.push(
			LSP.Diagnostic.create(range, message, severity)
		);
	}



}