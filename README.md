# Petrel Language Server

Code plugin implementing a language server for model code defined on the petrel platform

## Functionality

This Language Server works for petrel xml files. It has the following language features:
- Completions
- Diagnostics
- Outline view

It also includes an End-to-End test.

## Structure

```
.
├── client // Language Client
│   ├── src
│   │   ├── test // End to End tests for Language Client / Server
│   │   └── extension.ts // Language Client entry point
├── package.json // The extension manifest.
└── server // Language Server
    └── src
        ├── server.ts // Language Server entry point which initializes the PetrelLanguageServer and forwards requests
        ├── petrelLanguageServer.ts // Implements the petrel language server. Initializes various 
        │                              components and delegates requests (autocomplete/analyze files/find definition...) 
        │                              to the components 
        ├── completion // Anything related to completion requests 
        ├── document-symbol // Defines the document symbol provider which returns document symbols for a open document. The document symbols are used for the outline view as well as searching symbols in the current document. 
        ├── file-analyzer
        │   ├── analyzer.ts // Responsible for gathering files and passing them to a parser, updates the symbolAndReferenceManager 
        │   │                  with  the output
        │   └── parser // Includes various parserss
        ├── model-checker // Anything related to model validation
        ├── model-definition // Definition of the model used for parsing files, autocompletes and performing validations
        ├── on-definition-or-reference // Anything related to providing definitions (go-to-definition) or references (go-to-references)
        ├── symbol-and-reference-manager
        │   ├── symbolAndReferenceManager.ts // Holds de parsed model trees and provides efficients ways to query the results.          
        │   │                                   Is injected into various other components which require access to the model.
        │   └── modelManager.ts // Extends the symbolAndReferenceManager with specific queries holding more detailed platform knowledge
        └── utils
```

## Running the language server for developers

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press `Ctrl+Shift+B` to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config, or press `<F5>` key.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- Open your root folder