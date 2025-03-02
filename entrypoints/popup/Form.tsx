import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid2 as Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { useAtom, useAtomValue } from "jotai";
import { omit } from "lodash";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import {
  defaultFormState,
  FormData,
  formSchema,
  formStateAtom,
  tagsAtom,
} from "./atoms";

export default function Form() {
  const [defaultValues, setDefaultValues] = useAtom(formStateAtom);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timestamp: new Date(),
      ...omit(defaultValues, ["timestamp"]),
    },
  });

  // Watch content field for live preview
  const content = watch("content");

  // Get available tags from the atom
  const availableTags = useAtomValue(tagsAtom);
  const [inputValue, setInputValue] = useState("");

  // Filter tags based on input
  const filteredOptions = useMemo(() => {
    if (!Array.isArray(availableTags)) return [];
    return inputValue === ""
      ? availableTags
      : availableTags.filter((tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase())
        );
  }, [availableTags, inputValue]);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setDefaultValues(data);
  };

  const handleClear = () => {
    setDefaultValues(defaultFormState);
    reset(defaultFormState);
  };

  console.log("content", defaultValues.content);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Stack spacing={3}>
          <Controller
            name="timestamp"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                label="Date & Time"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.timestamp,
                    helperText: errors.timestamp?.message,
                  },
                }}
              />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                freeSolo
                options={filteredOptions}
                value={field.value}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={(_, newValue) => field.onChange(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      onDelete={() => {
                        const newTags = [...field.value];
                        newTags.splice(index, 1);
                        field.onChange(newTags);
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags"
                    error={!!errors.tags}
                    helperText={errors.tags?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Slug"
                fullWidth
                error={!!errors.slug}
                helperText={errors.slug?.message}
              />
            )}
          />

          <Grid container spacing={2}>
            <Grid size={6}>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setDefaultValues((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }));
                    }}
                    label="Content (Markdown)"
                    multiline
                    rows={8}
                    fullWidth
                    error={!!errors.content}
                    helperText={errors.content?.message}
                    placeholder="Write your content in markdown format..."
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  height: "100%",
                  maxHeight: "calc(8 * 1.5rem + 2rem)", // Match textarea height
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  gutterBottom
                >
                  Preview
                </Typography>
                <Box
                  sx={{
                    textAlign: "left",
                    blockquote: {
                      borderLeft: "4px solid #ccc",
                      margin: 0,
                      paddingLeft: 1,
                    },
                  }}
                >
                  <ReactMarkdown>{content || "*No content yet*"}</ReactMarkdown>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={6}>
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClear}
              >
                Clear Form
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
