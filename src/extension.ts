'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

module WorkSpace
{
    export function getActiveDocument() : vscode.TextDocument | null
    {
        var activeTextEditor = vscode.window.activeTextEditor;
        if (null !== activeTextEditor && undefined !== activeTextEditor)
        {
            var document = activeTextEditor.document;
            if (null !== document && undefined !== document)
            {
                return document;
            }
        }
        return null;
    };
}

export module bomswitcher
{
    var indicator : vscode.StatusBarItem;

    /*
    function getConfiguration<type>(key?: string): type
    {
        var configuration = vscode.workspace.getConfiguration("bom-switcher");
        return key ?
            configuration[key] :
            configuration;
    }
    */

    export function registerCommand(context: vscode.ExtensionContext): void
    {
        indicator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        context.subscriptions.push(indicator);

        context.subscriptions.push
        (
            vscode.commands.registerCommand
            (
                'bom-switcher.attachBOM', attachBOM
            )
        );
        context.subscriptions.push
        (
            vscode.commands.registerCommand
            (
                'bom-switcher.detachBOM', detachBOM
            )
        );
        vscode.workspace.onDidChangeTextDocument
        (
            (_e_editor : vscode.TextDocumentChangeEvent) =>
            {
                update();
            }
        );
        update();
    }

    function isWithBOM(document : vscode.TextDocument) : boolean
    {
        return "\u00A0" === document.getText(new vscode.Range(new vscode.Position(0, 0),new vscode.Position(0, 1)));
    }
    export async function update() : Promise<void>
    {
        const document =  WorkSpace.getActiveDocument();
        if (document)
        {
            if (isWithBOM(document))
            {
                indicator.text = "💣";
                indicator.command = 'bom-switcher.detachBOM';
            }
            else
            {
                indicator.text = "🌀";
                indicator.command = 'bom-switcher.attachBOM';
            }
        }
        else
        {
            indicator.text = "🚧";
            //indicator.color = color;
            indicator.command = undefined;
        }
        indicator.show();
    }
    export async function attachBOM() : Promise<void>
    {
        vscode.window.showInformationMessage("'attachBOM' is called. ( But, this command does nothing. )");
    }
    export async function detachBOM() : Promise<void>
    {
        vscode.window.showInformationMessage("`detachBOM' is called. ( But, this command does nothing. )");
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    bomswitcher.registerCommand(context);
}

// this method is called when your extension is deactivated
export function deactivate()
{
}
