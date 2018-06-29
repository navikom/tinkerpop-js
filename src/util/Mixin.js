export function mixin(object) {
  const mixins = Array.prototype.slice.call(arguments, 1);
  for (let i = 0; i < mixins.length; ++i) {
    for (const prop in mixins[i]) {
      if (typeof object.prototype[prop] === 'undefined') {
        object.prototype[prop] = mixins[i][prop];
      }
    }
  }
}

export function mixin_2(object) {
  const mixins = Array.prototype.slice.call(arguments, 1);
  for (let i = 0; i < mixins.length; ++i) {
    for (const prop in mixins[i]) {
      if (typeof object.prototype[prop] === 'undefined') {
        const bindMethod = function (mixin, prop) {
          return function () {
            mixin[prop].apply(this, arguments);
          };
        };

        object.prototype[prop] = bindMethod(mixins[i], prop);
      }
    }
  }
}
