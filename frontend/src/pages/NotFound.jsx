import { Link as RouterLink } from "react-router-dom";
import { Container, Typography, Button, Stack } from "@mui/material";

export default function NotFound() {
    return (
        <Container sx={{ py: 6, textAlign: "center" }}>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h3">404</Typography>
                <Typography variant="h6" color="text.secondary">This page is not found.</Typography>
                <Button variant="contained" component={RouterLink} to="/">Back to home page.</Button>
            </Stack>
        </Container>
    );
}