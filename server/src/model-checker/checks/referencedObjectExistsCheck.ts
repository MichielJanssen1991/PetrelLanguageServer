import { Reference, TreeNode } from '../../model-definition/types/tree';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';
import { attributeValueIsAVariable } from '../../util/other';
import { standaloneObjectTypes } from '../../model-definition/definitions/other';
import { ModelDetailLevel, ModelElementTypes } from '../../model-definition/types/definitions';

export class ReferencedObjectExistsCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All
	protected matchCondition = undefined
	detailLevel: ModelDetailLevel = ModelDetailLevel.Declarations;

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions)
	{
		const references = Object.values(node.attributes).filter(x=>x.isReference) as Reference[];
		references.forEach(x => this.verifyReferencedObjectExists(x as Reference, options));		
	}

	private verifyReferencedObjectExists(reference: Reference, options:ModelCheckerOptions) {
		if (!reference.types.some(type=>standaloneObjectTypes.has(type))) { return; } //Nodes which require context are checked as part of their parent
		
		const referencedSymbol = this.modelManager.getReferencedObject(reference);
		const name = reference.value;
		const referenceNotFound = (!referencedSymbol && name && !attributeValueIsAVariable(name)) as boolean;
		
		if (reference.types.includes(ModelElementTypes.InfosetVariable)){return;}//Handled in infoset action call check
		
		if (referenceNotFound) {
			this.addMessage(reference.range, "ROC0001", CHECKS_MESSAGES.REFERENCE_NOT_FOUND(reference));
		}
		if (referencedSymbol && name != referencedSymbol.name && name.toLowerCase() == referencedSymbol.name.toLowerCase() && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.addMessage(reference.range, "ROC0002", CHECKS_MESSAGES.REFERENCE_CAPITALIZATION(referencedSymbol, reference));
		}
		const symbolIsObsolete = (referencedSymbol && referencedSymbol.contextQualifiers.isObsolete) as boolean;
		if (symbolIsObsolete) {
			this.addMessage(reference.range, "ROC0003", CHECKS_MESSAGES.REFERENCE_OBSOLETE(reference));
		}
		
		return !symbolIsObsolete && !referenceNotFound;
		
	}

}