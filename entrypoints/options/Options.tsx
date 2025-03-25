import { zodResolver } from "@hookform/resolvers/zod";
import CheckIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { storage } from "wxt/storage";
import { z } from "zod";
const optionsSchema = z.object({
  githubPat: z.string().min(1, "GitHub Personal Access Token is required"),
  repoPath: z.string().min(1, "GitHub repo path is required"),
});

type OptionsData = z.infer<typeof optionsSchema>;

export const Options = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OptionsData>({
    resolver: zodResolver(optionsSchema),
  });

  const patKey = "sync:githubPat";
  const repoKey = "sync:repoPath";

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const [pat, repo] = await Promise.all([
        storage.getItem<string>(patKey),
        storage.getItem<string>(repoKey),
      ]);
      if (pat) {
        setValue("githubPat", pat);
      }
      if (repo) {
        setValue("repoPath", repo);
      }
    })();
  }, [setValue]);

  const onSubmit = async (data: OptionsData) => {
    await Promise.all([
      storage.setItem(patKey, data.githubPat),
      storage.setItem(repoKey, data.repoPath),
    ]);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Extension Options
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <TextField
            {...register("githubPat")}
            label="GitHub Personal Access Token"
            type="password"
            fullWidth
            error={!!errors.githubPat}
            helperText={errors.githubPat?.message}
          />
          <TextField
            {...register("repoPath")}
            label="GitHub Repository Path"
            fullWidth
            error={!!errors.repoPath}
            helperText={errors.repoPath?.message || "e.g. owner/repo/path"}
          />
          <Box>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Button type="submit" variant="contained">
                Save
              </Button>

              {showSuccess && <CheckIcon color="success" />}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};
