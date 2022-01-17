import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';

export class DiagnosticsCollection {
	private diagnostics: Diagnostic[] = [];
	private diagnosticDefinitions: Record<string, DiagnosticSeverity> = {
		// model definition check messages
		"MDC0001": DiagnosticSeverity.Error,
		"MDC0002": DiagnosticSeverity.Error,
		"MDC0003": DiagnosticSeverity.Error,
		"MDC0004": DiagnosticSeverity.Error,
		"MDC0005": DiagnosticSeverity.Error,
		"MDC0006": DiagnosticSeverity.Error,
		"MDC0007": DiagnosticSeverity.Error,
		"MDC0008": DiagnosticSeverity.Error,
		"MDC0009": DiagnosticSeverity.Error,
		"MDC0010": DiagnosticSeverity.Error,

		// call check messages
		"CC0001": DiagnosticSeverity.Warning,
		"CC0002": DiagnosticSeverity.Warning,
		"CC0003": DiagnosticSeverity.Error,
		"CC0004": DiagnosticSeverity.Error,
		"CC0005": DiagnosticSeverity.Error,
		"CC0006": DiagnosticSeverity.Error,
		"CC0007": DiagnosticSeverity.Information,
		"CC0008": DiagnosticSeverity.Error,
		
		// declaration check messages
		"DC0001": DiagnosticSeverity.Error,
		"DC0002": DiagnosticSeverity.Error,
		"DC0003": DiagnosticSeverity.Information,
		"DC0004": DiagnosticSeverity.Warning,

		// referenced object check 
		"ROC0001": DiagnosticSeverity.Error,
		"ROC0002": DiagnosticSeverity.Information,
		"ROC0003": DiagnosticSeverity.Error,
		"ROC0004": DiagnosticSeverity.Information,
		"ROC0005": DiagnosticSeverity.Information,

		// model parser messages
		"MP0001": DiagnosticSeverity.Error,

		// javascript parser messages
		"JP0001": DiagnosticSeverity.Warning,
		"JP0002": DiagnosticSeverity.Warning,

		// general messages
		"GM0001": DiagnosticSeverity.Error,
	}

	public getDiagnostics() {
		return this.diagnostics;
	}

	public clearDiagnostics() {
		this.diagnostics = [];
	}

	protected addMessage(range: Range, id: string, message: string) {
		switch(this.diagnosticDefinitions[id]){
			case DiagnosticSeverity.Error:
			case DiagnosticSeverity.Warning:
			case DiagnosticSeverity.Information:
				this.addDiagnostic(range, message, this.diagnosticDefinitions[id]);
				break;
			default:
				// no message
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