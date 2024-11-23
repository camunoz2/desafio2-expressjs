const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(express.json());

const getFile = (file) => {
  return path.join(__dirname, file);
};

app.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(getFile("index.html"), "utf8");
    res.send(data);
  } catch (err) {
    res.status(500).send("Error reading home");
  }
});

app.get("/canciones", async (req, res) => {
  try {
    const data = await fs.readFile(getFile("repertorio.json"), "utf8");
    const canciones = JSON.parse(data);
    res.json(canciones);
  } catch (parseError) {
    console.log("Error con parseo: ", parseError);
    res.status(500).send("Error parseando el  json");
  }
});

app.post("/canciones", async (req, res) => {
  const newSong = req.body;

  try {
    const data = await fs.readFile(getFile("repertorio.json"), "utf8");
    const songList = JSON.parse(data);
    songList.push(newSong);
    await fs.writeFile(
      getFile("repertorio.json"),
      JSON.stringify(songList, null, 2),
    );
    res.send("Cancion agregada");
  } catch (err) {
    console.error(err);
    res.send.status(500).send("Error agregando cancion");
  }
});

app.put("/canciones/:id", async (req, res) => {
  const songId = req.params.id;
  const updatedSong = req.body;

  try {
    const data = await fs.readFile(getFile("repertorio.json"), "utf8");
    const songList = JSON.parse(data);

    const index = songList.findIndex((song) => song.id === Number(songId));

    if (index === -1) {
      return res.status(404).send("Cancion no encontrada");
    }

    songList[index] = { ...songList[index], ...updatedSong };

    await fs.writeFile(
      getFile("repertorio.json"),
      JSON.stringify(songList, null, 2),
    );

    res.send("Cancion actualizada!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updateando la cancion");
  }
});

app.delete("/canciones/:id", async (req, res) => {
  const songId = req.params.id;

  try {
    const data = await fs.readFile(getFile("repertorio.json"), "utf8");
    const songList = JSON.parse(data);
    const index = songList.findIndex((song) => song.id === Number(songId));

    console.log("Received id:", songId);
    console.log("Song list:", songList);

    if (index === -1) {
      return res.status(404).send("Cancion no encontrada");
    }

    songList.splice(index, 1);

    await fs.writeFile(
      getFile("repertorio.json"),
      JSON.stringify(songList, null, 2),
    );
    res.send("Cancion eliminada exitosamanet");
  } catch (err) {
    console.error(err);
    res.send.status(500).send("Error deleting the file");
  }
});

app.listen(3000, (req, res) => {
  console.log("Servidor iniciado");
});
