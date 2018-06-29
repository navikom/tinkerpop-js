// works in firefox
const writeTextFile = (text, filename) => {
	save( new Blob( [ text ], { type: 'text/plain' } ), filename );
};

const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

const save = ( blob, filename ) => {

	link.href = URL.createObjectURL( blob );
	link.download = filename || 'data.json';
	link.click();

	// URL.revokeObjectURL( url ); breaks Firefox...

};


export { writeTextFile };
