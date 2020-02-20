const server = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');

server.use(bodyParser.json());

server.get('/users', (req, res) => {
    fs.readFile('data.json', (err, rawData) => {
        if (err) {
            res.send({"Status": "ok", "Message": "Error al leer el archivo de datos. Contacta con Jose."});
            throw err;
        }
        let data = JSON.parse(rawData);
        res.send(data);
    })
})

server.get('/user/:id', (req, res) => {
    if (!isNaN(req.params.id)){
        fs.readFile('data.json', (err, rawData) => {
            if (err) {
                res.send({"Status": "Error", "Message": "Error al leer el archivo de datos. Contacta con Jose."});
                throw err;
            }
            let data = JSON.parse(rawData);
            let user = data.filter(obj => {
                return obj.id == req.params.id
            })
            if (user.length === 0){
                res.send({"Status": "Error", "Message": "Ese ID ya no existe en esta base de datos."});
            } else {
                res.send(user);
            }
        })
    } else {
        res.send({"Status": "error", "Message": "No has mandado bien el path param"})
    }
})

server.post('/users', (req, res)=>{
    fs.readFile('data.json', (err, rawData) => {
        if (err) {
            res.send({"Status": "ok", "Message": "Error al leer el archivo de datos. Contacta con Jose."});
            throw err;
        }
        let data = JSON.parse(rawData);
        let lastID = 0;
        for (const user of data) {
            if (user["id"] > lastID){
                lastID = user["id"]
            }
            lastID++;
        }
        if (req.body.FirstName && req.body.SecondName && req.body.Departamento && req.body.Salario ){
            let newData = {
                "FirstName": req.body.FirstName,
                "SecondName": req.body.SecondName,
                "Departamento": req.body.Departamento,
                "Salario": req.body.Salario,
                "id": lastID
            }
            data.push(newData);
            fs.writeFile('data.json', JSON.stringify(data), (err) => {
                if (err) {
                    res.send({"Status": "ok", "Message": "Error al escribir los datos. Contacta con Jose."});
                    throw err;
                }
                res.send({"Status": "ok", "Message": "User created", "user": newData})
            })
        } else {
            res.send({"Status": "error", "Message": "Body mal formado"});
        }
    })
})

server.delete('/user/:id', (req, res) => {
    if (!isNaN(req.params.id)){
        fs.readFile('data.json', (err, rawData) => {
            if (err) {
                res.send({"Status": "Error", "Message": "Error al leer el archivo de datos. Contacta con Jose."});
                throw err;
            }
            let data = JSON.parse(rawData);

            let elementIndex = data.map(function(e) { return e.id; }).indexOf(parseInt(req.params.id));

            if (elementIndex === -1){
                res.send({"Status": "Error", "Message": "Ese ID ya no existe en esta base de datos."});
            } else {
                data.splice(elementIndex, 1)
                fs.writeFile('data.json', JSON.stringify(data), (err) => {
                    if (err) {
                        res.send({"Status": "ok", "Message": "Error al escribir los datos. Contacta con Jose."});
                        throw err;
                    }
                    res.send({"Status": "ok", "Message": "Usuario eliminado con éxito."});
                })
            }
        })
    } else {
        res.send({"Status": "error", "Message": "No has mandado bien el path param"})
    }
})

server.put('/users', (req, res)=>{
    fs.readFile('data.json', (err, rawData) => {
        if (err) {
            res.send({"Status": "Error", "Message": "Error al leer el archivo de datos. Contacta con Jose."});
            throw err;
        }
        let data = JSON.parse(rawData);
        if (req.body.FirstName && req.body.SecondName && req.body.Departamento && req.body.Salario && !isNaN(req.body.id)){
            let elementIndex = data.map(function(e) { return parseInt(e.id); }).indexOf(parseInt(req.body.id));
            if (elementIndex !== -1){
                let newData = {
                    "FirstName": req.body.FirstName,
                    "SecondName": req.body.SecondName,
                    "Departamento": req.body.Departamento,
                    "Salario": req.body.Salario,
                    "id": req.body.id
                }
                data.splice(elementIndex, 1, newData)
                fs.writeFile('data.json', JSON.stringify(data), (err) => {
                    if (err) {
                        res.send({"Status": "ok", "Message": "Error al escribir los datos. Contacta con Jose."});
                        throw err;
                    }
                    res.send({"Status": "ok", "Message": "User edited", "user": newData})
                })
            } else {
                res.send({"Status": "error", "Message": "Ese ID de usuario no existe en la base de datos."});
            }
        } else {
            res.send({"Status": "error", "Message": "Body mal formado"});
        }
    })
})


server.listen(3000, ()=>{console.log("listening on port 3000")})