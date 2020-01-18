module.exports = (client, klaw, fileSync) => {

    let items = [];
    klaw('./Commands').on('readable', function(){
        let item;
        while(item = this.read()){
            items.push(item.path)
        }
    }).on('end', function(){
        items.forEach(file => {
            if(file.endsWith('.js') == false) return;
            if(fileSync.isDir(file) == true) return;
            let prop = require(file)
            client.commands.set(prop.name, prop)
            if(prop.aliases == undefined) return;
            prop.aliases.forEach(alias => {
                client.aliases.set(alias, prop)
            })
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