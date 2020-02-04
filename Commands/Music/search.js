module.exports = {
    name: "search",
    usage: "search",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "searches for a song to be played!",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {
        
    }
}