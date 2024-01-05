const service = require("./reservations.service")






/**
 * List handler for reservation resources
 */

async function list(req, res) {

  const date = req.query.date;
  
  const data = await service.list()
  

//   const filteredData = data.filter(element => {
//     const formattedDate = element.reservation_date.toISOString().split('T')[0]
    
//     return formattedDate === date;
    
//   })
// //if there is a date specified, return only those that match the reservation date
//    if(date){
//     res.json({data :filteredData})}else{
//       res.json({data})
//     }

res.json({data})
  
}

async function create(req,res){
  const newReservation = await service.create(req.body.data)

  newReservation.reservation_id++

  res.status(201).json({
    data: newReservation
  })
}

module.exports = {
  list, create
};
