import * as glob from 'glob';
import * as URL from 'url';

const excludedDirectories: string[] = ["dist", "Themes", "node_modules", "packages", "no-version", "Content", "bin", "_svnSources", "ui-tests", "api-tests"];
const globPatternXml = '**/*@(.xml)';
const globPatternJs = '**/*@(.js)';
const globOptions = { nodir: true, absolute: true, strict: false, follow: false };

export function formatFileURL(url: string) {
  return new URL.URL(url).toString().replace("c:", "c%3A").replace("d:", "d%3A");
}

export function filePathToFileURL(path: string) {
  return formatFileURL(URL.pathToFileURL(path).toString());
}

export function getFileExtension(uri: string) {
  return uri.split('.').pop()||"";
}

export function getModelFilePaths(rootPath: string, options?: { skipFolders: string[] }): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(globPatternXml, { ...globOptions, cwd:rootPath },
      function (err, files) {
        if (err) {
          return reject(err);
        }
        files = files.filter(x => !x.endsWith(".resolved.xml"));
        files = removeFilesFromDirectories([...excludedDirectories, ...options?.skipFolders||[]], files);
        files = removeDesignTimeFiles(files);
        resolve(files);
      },
    );
  });
}

export function getJavascriptFilePaths(rootPath: string, options?: { skipFolders: string[] }): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(globPatternJs, { ...globOptions, cwd:rootPath },
      function (err, files) {
        if (err) {
          return reject(err);
        }
        files = removeFilesFromDirectories([...excludedDirectories, ...options?.skipFolders||[]], files);
        resolve(files);
      },
    );
  });
}

export function removeFilesFromDirectories(excludedDirectories: string[], files: string[]) {
  for (const dir of excludedDirectories) {
    files = files.filter(x => !x.includes(`/${dir}/`));
  }
  return files;
}

function removeDesignTimeFiles(files: string[]) {
  const directoriesRuntimeOnly: string[] = ["CForms", "Controller", "CQueries", "CFormSets"];
  for (const dir of directoriesRuntimeOnly) {
    files = files.filter(x => (!(x.includes(`/${dir}/`) && x.includes("versions")) || x.includes(`/${dir}/Runtime/`)));
  }
  return files;
}