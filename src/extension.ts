import * as vscode from "vscode";
import { exec, execSync } from "child_process";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "laravel-pint-auto-format" is now active!'
  );

  // Command formatter (manual trigger)
  const disposableCommand = vscode.commands.registerCommand(
    "laravel-pint-auto-format.formatWithPint",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      try {
        await formatDocument(editor.document);
        await editor.document.save();
        vscode.window.showInformationMessage("Formatted with Pint");
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error formatting with Pint: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  );

  // Automatic formatter
  const disposableFormatter =
    vscode.languages.registerDocumentFormattingEditProvider(
      { language: "php" },
      {
        provideDocumentFormattingEdits(
          document: vscode.TextDocument
        ): vscode.TextEdit[] {
          try {
            const workspaceFolder =
              vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            if (!workspaceFolder) {
              throw new Error("No workspace folder found");
            }

            execSync(`php vendor/bin/pint "${document.fileName}"`, {
              cwd: workspaceFolder,
            });

            const formatted = fs.readFileSync(document.fileName, "utf8");
            const lastLine = document.lineAt(document.lineCount - 1);
            const fullRange = new vscode.Range(
              new vscode.Position(0, 0),
              lastLine.range.end
            );

            return [vscode.TextEdit.replace(fullRange, formatted)];
          } catch (error) {
            vscode.window.showErrorMessage(
              `Pint formatting failed: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
            return [];
          }
        },
      }
    );

  context.subscriptions.push(disposableCommand, disposableFormatter);
}

async function formatDocument(document: vscode.TextDocument): Promise<void> {
  return new Promise((resolve, reject) => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      reject(new Error("No workspace folder found"));
      return;
    }

    exec(
      `php vendor/bin/pint "${document.fileName}"`,
      { cwd: workspaceFolder },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }
        resolve();
      }
    );
  });
}

export function deactivate() {}
