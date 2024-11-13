const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

// Función de validación
function validarAnime(anime) {
  if (
    typeof anime.nombre === "string" &&
    typeof anime.genero === "string" &&
    typeof anime.año === "string" &&
    typeof anime.autor === "string"
  ) {
    return true;
  }
  return false;
}

// Ruta para obtener todos los animes
app.get("/animes", (req, res) => {
  fs.readFile("./anime.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");
    res.send(JSON.parse(data));
  });
});

// Ruta para obtener un anime por ID
app.get("/animes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./anime.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");
    const animes = JSON.parse(data);
    if (animes[id]) {
      res.send(animes[id]);
    } else {
      res.status(404).send("Anime no encontrado");
    }
  });
});

// Ruta para agregar un nuevo anime
app.post("/animes", (req, res) => {
  const nuevoAnime = req.body;

  if (!validarAnime(nuevoAnime)) {
    return res
      .status(400)
      .send(
        "Datos de anime inválidos. Asegúrate de incluir nombre, genero, año y autor como cadenas de texto."
      );
  }

  fs.readFile("./anime.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");
    const animes = JSON.parse(data);
    const newId = (Object.keys(animes).length + 1).toString();
    animes[newId] = nuevoAnime;
    fs.writeFile("./anime.json", JSON.stringify(animes, null, 2), (err) => {
      if (err) return res.status(500).send("Error al escribir en el archivo");
      res.send(`Anime agregado con ID ${newId}`);
    });
  });
});

// Ruta para actualizar un anime por ID
app.put("/animes/:id", (req, res) => {
  const id = req.params.id;
  const camposActualizados = req.body;

  // Leer el archivo anime.json
  fs.readFile("./anime.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");

    const animes = JSON.parse(data);

    // Comprobar si el anime existe
    if (!animes[id]) {
      return res.status(404).send("Anime no encontrado");
    }

    // Actualizar solo los campos especificados
    const animeExistente = animes[id];
    const camposPermitidos = ["nombre", "genero", "año", "autor"];

    for (let campo in camposActualizados) {
      if (
        camposPermitidos.includes(campo) &&
        typeof camposActualizados[campo] === "string"
      ) {
        animeExistente[campo] = camposActualizados[campo];
      }
    }

    // Guardar los cambios en el archivo JSON
    fs.writeFile("./anime.json", JSON.stringify(animes, null, 2), (err) => {
      if (err) return res.status(500).send("Error al escribir en el archivo");
      res.send(`Anime con ID ${id} actualizado!`);
    });
  });
});

// Ruta para eliminar un anime por ID
app.delete("/animes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./anime.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");
    const animes = JSON.parse(data);
    if (animes[id]) {
      delete animes[id];
      fs.writeFile("./anime.json", JSON.stringify(animes, null, 2), (err) => {
        if (err) return res.status(500).send("Error al escribir en el archivo");
        res.send(`Anime con ID ${id} eliminado`);
      });
    } else {
      res.status(404).send("Anime no encontrado");
    }
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
