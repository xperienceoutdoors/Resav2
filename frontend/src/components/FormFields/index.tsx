import React from 'react';
import {
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useField } from 'formik';

interface TextFieldProps {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  [x: string]: any;
}

export const FormTextField: React.FC<TextFieldProps> = ({ ...props }) => {
  const [field, meta] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <TextField
      {...field}
      {...props}
      fullWidth
      error={!!errorText}
      helperText={errorText}
      margin="normal"
    />
  );
};

interface CheckboxProps {
  name: string;
  label: string;
  [x: string]: any;
}

export const FormCheckbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <FormControl error={!!errorText} margin="normal">
      <FormControlLabel
        control={<Checkbox {...field} {...props} />}
        label={label}
      />
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

interface SelectProps {
  name: string;
  label: string;
  options: { value: string | number; label: string }[];
  [x: string]: any;
}

export const FormSelect: React.FC<SelectProps> = ({
  label,
  options,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <FormControl fullWidth error={!!errorText} margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select {...field} {...props} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

interface DatePickerProps {
  name: string;
  label: string;
  [x: string]: any;
}

export const FormDatePicker: React.FC<DatePickerProps> = ({ ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <DatePicker
      {...props}
      value={field.value}
      onChange={(value) => helpers.setValue(value)}
      slotProps={{
        textField: {
          fullWidth: true,
          margin: 'normal',
          error: !!errorText,
          helperText: errorText,
        },
      }}
    />
  );
};

interface TimePickerProps {
  name: string;
  label: string;
  [x: string]: any;
}

export const FormTimePicker: React.FC<TimePickerProps> = ({ ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <TimePicker
      {...props}
      value={field.value}
      onChange={(value) => helpers.setValue(value)}
      slotProps={{
        textField: {
          fullWidth: true,
          margin: 'normal',
          error: !!errorText,
          helperText: errorText,
        },
      }}
    />
  );
};
