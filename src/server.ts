import fastify from 'fastify'

const app = fastify()

app.get('/', (req, res) => {
    res.send("server is ruinnig")
})

app.listen({
    port:3333,
}).then(() => {
    console.log('HTTP Server Running')
})