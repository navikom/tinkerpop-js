export default class JSONGenerator {

	constructor() {
		this.writeContext = '';
		this.started = false;
		this.stopped = false;
		this.json = {};
	}

	getOutputJSON(){
		return this.json;
	}
	getOutputContext() {
		return this.writeContext;
	}

	writeStartObject() {
		this.writeContext += '{';
	}

	writeObjectField(key, value) {
		this.writeFieldName(key);
		this.writeFieldValue(value);
	}

	writeStringField(key, value) {
		this.writeObjectField(key, value);
	}

	writeEndObject() {
		this.writeContext += '}';
	}

	writeFieldName(key) {
		this.writeContext += `"${key}":`;
	}

	writeFieldValue(value) {
		this.writeContext += `"${value}"`;
	}

	writeStartArray() {
		this.writeContext += '[';
	}

	writeEndArray() {
		this.writeContext += ']';
	}

	writeObject(object) {
		this.writeStartObject();
		this.writeFieldName(Object.keys(object)[0]);
		this.writeFieldValue(Object.values(object)[0]);
		this.writeEndObject();
	}

	writeComma(){
		this.writeContext += ',';
	}

	writeNextLine(){
		this.writeContext += '\n';
	}
	startGenerator(){
		this.started = true;
		this.stopped = false;
		this.writeStartArray();
	}
	stopGenerator(){
		this.started = false;
		this.stopped = true;
		this.writeEndArray();
		this.json = JSON.parse(this.writeContext);
	}
	startGeneratorForJava(){
		this.started = true;
		this.stopped = false;
	}
	stopGeneratorForJava(){
		this.started = false;
		this.stopped = true;
	}
}
