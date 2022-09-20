const basePath = process.cwd();
const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);

module.exports = function(app)
{
     app.get('/',function(req,res){
        console.log('hello world')
     });

     app.get('/create-new-collection', function(req, res){
        const namePrefix = req.query.name;
        const description = req.query.description;
        buildSetup(namePrefix);
        startCreating(namePrefix, description);
        result = {"success": 1};
        res.json(result)
     })
}