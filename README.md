# Petrel Languager Server

Code plugin implementing a language server for model code defined on the petrel platform

## Functionality

This Language Server works for petrel xml files. It has the following language features:
- Completions
- Diagnostics

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
        ├── file-analyzer
        │   ├── analyzer.ts // Responsible for gathering files and passing them to a parser, updates the symbolAndReferenceManager 
        │   │                  with  the output
        │   └── parser // Includes various parserss
        ├── model-checker // Anything related to model validation
        ├── model-definition // Definition of the model used for parsing files, autocompletes and performing validations
        ├── symbol-and-reference-manager
        │   ├── symbolAndReferenceManager.ts // Holds de parsed model trees and provides efficients ways to query the results.          
        │   │                                   Is injected to various other components which require access to the model.
        │   └── modelManager.ts // Extends the symbolAndReferenceManager with specific querying holding more detailed platform knowledge
        └── utils
```

## Running the language server for developers

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- Open your root folder