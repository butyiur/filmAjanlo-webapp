import { useEffect, useState } from "react";
import API from "../api/client";
import {
    Box, Grid, Card, CardContent, CardMedia, Typography, Button
} from "@mui/material";

export default function MyMovies() {
    const [movies, setMovies] = useState([]);

    const loadMovies = async () => {
        try {
            const res = await API.get("/user/movies");
            setMovies(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const removeMovie = async (id) => {
        try {
            await API.delete(`/user/movies/${id}`);
            loadMovies();  // újratöltés törlés után
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

    return (
        <Box p={4}>
            <Typography variant="h4" mb={3}>My Movies</Typography>
            <Grid container spacing={3}>
                {movies.map(movie => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="300"
                                image={movie.posterUrl || "https://placehold.co/300x450?text=No+Image"}
                            />
                            <CardContent>
                                <Typography variant="h6">{movie.title}</Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ mt: 1 }}
                                    onClick={() => removeMovie(movie.id)}
                                >
                                    Remove
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}