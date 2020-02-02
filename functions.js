module.exports = (client, klaw, fileSync) => {

    let methods = [];
    klaw('./Utils').on('readable', function(){
        let item;
        while(item = this.read()){
            methods.push(item.path)
        }
    }).on('end', function(){
        methods.forEach(filePath => {
            if(filePath.endsWith('.js') == false || fileSync.isDir(filePath) == true) return;
            require(filePath)
        })
    })

    let items = [];
    klaw('./Commands').on('readable', function(){
        let item;
        while(item = this.read()){
            items.push(item.path)
        }
    }).on('end', function(){
        items.forEach(file => {
            if(fileSync.isDir(file) == true){
                if(file.endsWith('.js') == true || file.endsWith("Commands") || file.includes('Commands') == false) return;
                let category = file.slice(file.lastIndexOf("\\")).slice(1)
                client.categories.push(category)
            } else if(file.endsWith('.js')){
                if(file.endsWith('.js') == false || fileSync.isDir(file) == true) return;
                let prop = require(file)
                if(prop.blackListed == true) return;
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
            handlerItems.push(item.path)
        }
    }).on('end', function(){
        handlerItems.forEach(file => {
            if(file.endsWith('.js') == false || fileSync.isDir(file) == true) return;
            require(file)(client);
        })
    })

    let eventItems = [];
    klaw('./Events').on('readable', function(){
        let item;
        while(item = this.read()){
            eventItems.push(item.path)
        }
    }).on('end', function(){
        eventItems.forEach(file => {
            if(file.endsWith('.js') == false || fileSync.isDir(file) == true) return;
            require(file)(client);
        })
    })

}