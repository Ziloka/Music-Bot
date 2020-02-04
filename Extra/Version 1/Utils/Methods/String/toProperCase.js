String.prototype.toProperCase = function(){
    let aa = [];
    this.split(' ').forEach(s => {
        aa.push(s.slice(0,1).toUpperCase() + s.slice(1,s.length).toLowerCase())
    })
    return aa.join(' ')
}