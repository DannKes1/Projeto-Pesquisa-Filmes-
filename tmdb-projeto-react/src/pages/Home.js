// src/pages/Home.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Pagination,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async (page = 1) => {
    const query = searchTerm.trim();
    if (!query) {
      setError("Digite um nome de filme antes de buscar.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/api/search`, {
        params: { query, page },
      });
      setMovies(response.data.results || []);
      setTotalPages(response.data.total_pages || 1);
      setCurrentPage(response.data.page || 1);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Ocorreu um erro ao buscar filmes.");
      }
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMovies(1);
  };

  const handlePageChange = (event, value) => {
    fetchMovies(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setMovies([]);
    setError("");
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Busca de Filmes
      </Typography>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <TextField
          label="Digite o nome do filme..."
          variant="outlined"
          fullWidth
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ marginLeft: "1rem" }}
        >
          Buscar
        </Button>
      </div>

      {loading && <CircularProgress />}

      {error && (
        <Typography color="error" variant="body1" sx={{ marginBottom: "1rem" }}>
          {error}
        </Typography>
      )}

      {!loading && movies.length === 0 && !error && (
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          Nenhum filme encontrado. Tente buscar por outro nome.
        </Typography>
      )}

      {movies.map((movie) => (
        <div
          key={movie.id}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none" }}>
            <Typography variant="h6">{movie.title}</Typography>
          </Link>
          <Typography variant="subtitle2">
            Data de lançamento: {movie.release_date}
          </Typography>
          <Typography variant="body2">{movie.overview}</Typography>
        </div>
      ))}

      {movies.length > 0 && (
        <Pagination
          count={totalPages > 500 ? 500 : totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
        />
      )}
    </Container>
  );
}

export default Home;
