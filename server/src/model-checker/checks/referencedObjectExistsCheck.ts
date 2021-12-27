import { ModelDetailLevel, ModelElementTypes, Reference, TreeNode } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';
import { attributeValueIsAVariable } from '../../util/other';
import { standaloneObjectTypes } from '../../model-definition/definitions/other';

export class ReferencedObjectExistsCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All
	protected matchCondition = undefined

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions)
	{
		const references = Object.values(node.attributes).filter(x=>x.isReference) as Reference[];
		references.forEach(x => this.verifyReferencedObjectExists(x as Reference, options));		
	}

	private verifyReferencedObjectExists(reference: Reference, options:ModelCheckerOptions) {
		if (!standaloneObjectTypes.has(reference.type)) { return; } //Nodes which require context are checked as part of their parent
		const referencedSymbol = this.modelManager.getReferencedObject(reference);
		const name = reference.value;
		const referenceNotFound = !referencedSymbol && name && !attributeValueIsAVariable(name); 
		if (referenceNotFound) {
			this.addError(reference.range, CHECKS_MESSAGES.REFERENCE_NOT_FOUND(reference));
		}
		if (referencedSymbol && name != referencedSymbol.name && name.toLowerCase() == referencedSymbol.name.toLowerCase() && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.addInformation(reference.range, CHECKS_MESSAGES.REFERENCE_CAPITALIZATION(referencedSymbol, reference));
		}
		const symbolIsObsolete = referencedSymbol && referencedSymbol.contextQualifiers.isObsolete;
		if (symbolIsObsolete) {
			this.addError(reference.range, CHECKS_MESSAGES.REFERENCE_OBSOLETE(reference));
		}
		return !symbolIsObsolete && !referenceNotFound;
		
	}

}