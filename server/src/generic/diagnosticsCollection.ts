import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';

export type DiagnosticDefinition = {
	severity: DiagnosticSeverity
}

export class DiagnosticsCollection {
	private diagnostics: Diagnostic[] = [];
	private diagnosticDefinitions: Record<string, DiagnosticSeverity> = {
		// STRC = Structure
		// idea is to have different kind of id's. Start with a string of 3 or 4 letters, then a number of length 5. Reference errors could be REF00001
		"STRC00001": DiagnosticSeverity.Error,
		"STRC00002": DiagnosticSeverity.Error,
		"STRC00003": DiagnosticSeverity.Error,
		"STRC00004": DiagnosticSeverity.Error,
		"STRC00005": DiagnosticSeverity.Error,
		"STRC00006": DiagnosticSeverity.Error,
		"STRC00007": DiagnosticSeverity.Error,
		"STRC00008": DiagnosticSeverity.Error,
		"STRC00009": DiagnosticSeverity.Error,
		"STRC00010": DiagnosticSeverity.Error,
	}

	public getDiagnostics() {
		return this.diagnostics;
	}

	public clearDiagnostics() {
		this.diagnostics = [];
	}

	protected addInformation(range: Range, message: string) {
		this.addDiagnostic(range, message, DiagnosticSeverity.Information);
	}

	protected addWarning(range: Range, message: string) {
		this.addDiagnostic(range, message, DiagnosticSeverity.Warning);
	}

	protected addError(range: Range, message: string) {
		this.addDiagnostic(range, message, DiagnosticSeverity.Error);
	}

	protected addMessage(range: Range, id: string, message: string) {
		switch(this.diagnosticDefinitions[id]){
			case DiagnosticSeverity.Error:
				this.addError(range, message);
				break;
			case DiagnosticSeverity.Warning:
				this.addWarning(range, message);
				break;
			case DiagnosticSeverity.Information:
				this.addInformation(range, message);
				break;
			default:
				// nothing
				break;
		}
	}

	protected addDiagnostic(range: Range, message: string, severity: DiagnosticSeverity) {
		this.diagnostics.push(
			Diagnostic.create(range, message, severity)
		);
	}

	protected addDiagnostics(diagnostics: Diagnostic[]) {
		this.diagnostics = this.diagnostics.concat(diagnostics);
	}
}