module.exports = (mongoose) => {
  const Schema = mongoose.Schema

  const clientSchema = new Schema({
    name: { type: String, required: true },
    bags: { type: Number, min: 1, max: 5 },
    flightCode: { type: String, required: true}
  }, { collation: {locale: 'es', strength: 1} })
  
  return mongoose.model('Client', clientSchema)
}
