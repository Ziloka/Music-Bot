Array.prototype.startsWith = function(text){
    return this.filter(str => str.startsWith(text))
}