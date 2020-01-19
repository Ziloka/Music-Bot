module.exports = (client, klaw, fileSync) => {

    let items = [];
    klaw('./Commands').on('readable', function(){
        let item;
        while(item = this.read()){
            items.push(item.path)
        }
    }).on('end', function(){
        items.forEach(file => {
            if(fileSync.isDir(file) == true){
                if(file.endsWith('.js') == true) return;
                if(file.endsWith("Commands")) return;
                if(file.includes("Commands") == false) return;
                let category = file.slice(file.lastIndexOf("\\")).slice(1)
                client.categories.push(`${category}`)
            } else if(file.endsWith('.js')){
                if(file.endsWith('.js') == false) return;
                if(fileSync.isDir(file) == true) return;
                let prop = require(file)
                if(prop.blackListed == true) return;
                prop.path = file
                client.commands.set(prop.name, prop)
                if(prop.aliases == undefined) return;
                prop.aliases.forEach(alias => {
                    client.aliases.set(alias, prop)
                })
            } else {
                return;
            }
        })
    })

    let handlerItems = [];
    klaw('./Handlers').on('readable', function(){
        let item;
        while(item = this.read()){
            items.push(item.path)
        }
    }).on('end', function(){
        handlerItems.forEach(file => {
            if(file.endsWith('.js') == false) return;
            if(fileSync.isDir(file) == true) return;
            require(file)
        })
    })

    let eventItems = [];
    klaw('./Events').on('readable', function(){
        let item;
        while(item = this.read()){
            items.push(item.path)
        }
    }).on('end', function(){
        eventItems.forEach(file => {
            if(file.endsWith('.js') == false) return;
            if(fileSync.isDir(file) == true) return;
            require(file)
        })
    })

}