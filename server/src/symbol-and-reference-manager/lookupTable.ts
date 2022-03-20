type ObjectsByName<Type> = { [name: string]: Type[] }
type ObjectsByNameByFile<Type> = { [uri: string]: ObjectsByName<Type> }
interface LookupTableObject {
	uri: string;
  }

export class LookupTable<Type extends LookupTableObject>{
	private objectsByNameByFile: ObjectsByNameByFile<Type> = {};
	private objectsByName: ObjectsByName<Type> = {};

	public clearForUri(uri:string) {
		const objects = this.objectsByNameByFile[uri];
		if(objects){
			const referenceNames = Object.keys(objects);
			referenceNames.forEach(name=> this.removeObject(uri, name));
		}
		this.objectsByNameByFile[uri] = {};
	}

	public addObject(object: Type, name:string) {
		const uri = object.uri;
		this.pushToObjectsByName(name, object);
		this.pushToObjectsByNameByFile(uri, name, object);
	}

	public getForName(name: string) {
		return this.objectsByName[name] || [];
	}

	public GetForFile(uri:string){
		return this.objectsByNameByFile[uri];
	}
	
	public getByNameByFile(){
		return this.objectsByNameByFile;
	}
	
	public getNames(){
		return Object.keys(this.objectsByName);
	}

	public getFiles(){
		return Object.keys(this.objectsByNameByFile);
	}
	
	private removeObject(uri: string, name:string) {
		let namedDeclarationsForName = this.objectsByName[name] || [];
		namedDeclarationsForName = namedDeclarationsForName.filter(x => x.uri != uri);
		this.objectsByName[name] = namedDeclarationsForName;
	}

	private pushToObjectsByName(name: string, object: Type) {
		const referencesForName = this.objectsByName[name] || [];
		referencesForName.push(object);
		this.objectsByName[name] = referencesForName;
	}

	private pushToObjectsByNameByFile(uri: string, name: string, object: Type) {
		const namedReferencesForNameAndFile = this.objectsByNameByFile[uri][name] || [];
		namedReferencesForNameAndFile.push(object);
		this.objectsByNameByFile[uri][name] = namedReferencesForNameAndFile;
	}
}