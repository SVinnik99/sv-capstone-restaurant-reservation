const service = require("./tables.service")



async function list(req,res,next){

    const data = await service.list()

    res.json({data})
}

async function create(req, res) {
    const newTable = await service.create(req.body.data);
  
    newTable.table_id++;
  
    res.status(201).json({
      data: newTable,
    });
  }


module.exports = {
    list,create
}