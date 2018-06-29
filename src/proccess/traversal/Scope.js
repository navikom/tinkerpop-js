export const Scope = {
	local: 'local',
	global: 'global',
	oposite: (value) => (value === Scope.global ? Scope.local : Scope.global)
};

const local = Scope.local;
const global = Scope.global;
const oposite = Scope.oposite;
export { local, global, oposite }
export default Scope;