// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Rota de busca de filmes com suporte a paginação
app.get("/api/search", async (req, res) => {
  const query = req.query.query; // /api/search?query=matrix
  const page = req.query.page || 1; // /api/search?query=matrix&page=2

  if (!query) {
    return res
      .status(400)
      .json({ error: 'Informe o parâmetro "query" na URL.' });
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    );
    // Retorna todos os dados, incluindo total_pages, page atual, etc.
    res.json(response.data);
  } catch (error) {
    // Captura detalhes do erro para depuração
    console.error("[ERRO /api/search]", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao buscar dados na TMDB." });
  }
});

// Rota para detalhes de um filme específico
app.get("/api/movie/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "[ERRO /api/movie/:id]",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json({ error: "Erro ao buscar detalhes do filme na TMDB." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
