import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';

export class DiagnosticsCollection {
	private diagnostics: Diagnostic[] = [];

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

	protected addDiagnostic(range: Range, message: string, severity: DiagnosticSeverity) {
		this.diagnostics.push(
			Diagnostic.create(range, message, severity)
		);
	}

	protected addDiagnostics(diagnostics: Diagnostic[]) {
		this.diagnostics = this.diagnostics.concat(diagnostics);
	}
}