Map.prototype.clone = function(){
    let newMap = new Map()
    for(let coll of this){
       newMap.set(coll[0],coll[1])
    }
    return newMap
 }