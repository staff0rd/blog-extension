import { Box, CssBaseline } from "@mui/material";
import Form from "./Form";

function App() {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          //margin: "0 auto",
          padding: 2,
          textAlign: "center",
        }}
      >
        <Form />
      </Box>
    </>
  );
}

export default App;
