const isNull = (value) => value === null || value === undefined;
const getRandomArbitrary = (min, max) => {
	let rand = min + Math.random() * (max + 1 - min);
	rand = Math.floor(rand);
	return rand;
};
export { isNull, getRandomArbitrary }