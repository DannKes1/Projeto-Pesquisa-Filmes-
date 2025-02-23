// src/pages/MovieDetails.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import { Container, Typography, CircularProgress, Button } from "@mui/material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/api/movie/${id}`);
        setMovie(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Ocorreu um erro ao buscar detalhes do filme.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ marginTop: "2rem" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ marginTop: "2rem" }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained">
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Voltar
          </Link>
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ marginTop: "2rem" }}>
        <Typography>Nenhum detalhe encontrado.</Typography>
        <Button variant="contained">
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Voltar
          </Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: "2rem" }}>
      <Button variant="contained" sx={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Voltar
        </Link>
      </Button>

      <Typography variant="h4" gutterBottom>
        {movie.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Data de lançamento: {movie.release_date}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Avaliação: {movie.vote_average}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
        {movie.overview}
      </Typography>

      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
          style={{ width: "300px", borderRadius: "8px" }}
        />
      )}
    </Container>
  );
}

export default MovieDetails;
