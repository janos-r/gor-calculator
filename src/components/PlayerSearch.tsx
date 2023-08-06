import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ApiPlayer } from "@/app/s/[dyn]/route";
import {
  Autocomplete,
  AutocompleteOption,
  CircularProgress,
  Typography,
} from "@mui/joy";
import { PersonSearch } from "@mui/icons-material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

// After input, wait ms before fetch
const debounce = 400;

export default function PlayerSearch(
  props: {
    value: ApiPlayer | null;
    setValue: Dispatch<SetStateAction<ApiPlayer | null>>;
  },
) {
  const { value, setValue } = props;
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ApiPlayer[]>([]);

  useEffect(() => {
    let active = true;
    // Debounce handler
    let handler: NodeJS.Timeout;

    const fetchFn = async () => {
      setLoading(true);

      const res = await fetch(`/s/${inputValue}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      // don't write the fetch result if not active anymore
      if (active) {
        const names: ApiPlayer[] = await res.json();
        setOptions(names);
        setLoading(false);
      }
    };

    // Fetch api doesn't handle whitespace
    if (inputValue.length > 2 && !/\s/.test(inputValue)) {
      // Debounce time in ms
      handler = setTimeout(fetchFn, debounce);
    } else if (inputValue.length === 0) {
      // when cleared (by backspace or clear event)
      setOptions([]);
    }

    // Runs on new input
    return () => {
      // The handler from the previous effect. If the timeout still exists and gets cleared, this creates the debounce behavior.
      clearTimeout(handler);
      setLoading(false);
      // Tag latest (active) cycle.
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      variant="soft"
      startDecorator={<PersonSearch />}
      endDecorator={loading ? <CircularProgress size="sm" /> : null}
      placeholder="Search by last name..."
      options={options}
      filterOptions={(x) => x} // to skip the components filter
      sx={{ width: 300, borderRadius: 10 }}
      freeSolo // allows to enter on input instead of option, not ideal, but prevents the immediate "No options" message
      clearOnBlur
      clearOnEscape
      blurOnSelect
      handleHomeEndKeys
      value={value}
      selectOnFocus // This is recommended, but I didn't see it having an effect
      onChange={(_event, newValue, _reason) => {
        // options should always be the object, but the library seams to always suspect also string, thats why the as
        setValue(newValue as ApiPlayer);
        setOptions([]);
      }}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue, _reason) => {
        setInputValue(newInputValue);
      }}
      // Added just to avoid errors in the browser. The renderOption would be enough to print the options.
      getOptionLabel={(option) =>
        // this type guard is to workaround the library restriction (all options should be object, not string)
        (typeof option === "string")
          ? option
          : `${option.fullName} (${option.rank})`}
      // match highlighting
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option.fullName, inputValue, {
          insideWords: true,
        });
        const parts = parse(option.fullName, matches);
        return (
          <AutocompleteOption {...props}>
            <Typography level="inherit">
              {`${option.rank} - `}
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  {...(part.highlight && {
                    variant: "soft",
                    color: "info",
                    fontWeight: "lg",
                    px: "2px",
                  })}
                >
                  {part.text}
                </Typography>
              ))}
            </Typography>
          </AutocompleteOption>
        );
      }}
    />
  );
}
