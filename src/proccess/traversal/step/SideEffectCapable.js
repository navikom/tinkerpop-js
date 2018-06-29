import Generating from './Generating';

/**
 * SideEffectCapable
 * @constructor
 */
function SideEffectCapable(){
	Generating.call(this);
}

SideEffectCapable.prototype = Object.create(Generating.prototype);
SideEffectCapable.prototype.constructor = SideEffectCapable;

SideEffectCapable.prototype.capableType = 'SideEffectCapable';

SideEffectCapable.TYPE = 'SideEffectCapable';

export default SideEffectCapable;