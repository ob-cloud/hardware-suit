String.prototype.toCapital = function(): string {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};

String.prototype.toLower = function(): string {
  return this.slice(0, 1).toLowerCase() + this.slice(1);
};

String.prototype.format = function(..._args: readonly string[]) {
  if (arguments.length === 0) {
    return this.toString();
  }
  let s = this;
  for (let i = 0; i < arguments.length; i++) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i]);
  }
  return s.toString();
};