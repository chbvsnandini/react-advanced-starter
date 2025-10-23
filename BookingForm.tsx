import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addDays, format } from 'date-fns';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  travelers: Yup.number()
    .required('Number of travelers is required')
    .min(1, 'At least 1 traveler is required')
    .max(10, 'Maximum 10 travelers allowed'),
  departureDate: Yup.date()
    .required('Departure date is required')
    .min(new Date(), 'Departure date must be in the future'),
  returnDate: Yup.date()
    .required('Return date is required')
    .min(
      Yup.ref('departureDate'),
      'Return date must be after departure date'
    ),
});

interface BookingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  travelers: number;
  departureDate: Date | null;
  returnDate: Date | null;
}

const initialValues: BookingFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  travelers: 1,
  departureDate: addDays(new Date(), 1),
  returnDate: addDays(new Date(), 8),
};

export default function BookingForm({ countryName }: { countryName: string }) {
  const handleSubmit = (values: BookingFormValues, { setSubmitting }: any) => {
    // Simulate API call
    setTimeout(() => {
      console.log('Booking submitted:', values);
        alert(`Booking submitted for ${countryName}! Check console for details.`);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Book Your Trip to {countryName}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="firstName"
                    as={TextField}
                    label="First Name"
                    fullWidth
                    error={touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    name="lastName"
                    as={TextField}
                    label="Last Name"
                    fullWidth
                    error={touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    name="email"
                    as={TextField}
                    label="Email"
                    fullWidth
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    name="travelers"
                    as={TextField}
                    select
                    label="Number of Travelers"
                    fullWidth
                    error={touched.travelers && !!errors.travelers}
                    helperText={touched.travelers && errors.travelers}
                  >
                    {[...Array(10)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Traveler' : 'Travelers'}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Departure Date"
                      value={values.departureDate}
                      onChange={(date) => setFieldValue('departureDate', date)}
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.departureDate && !!errors.departureDate,
                          helperText: touched.departureDate && errors.departureDate as string,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Return Date"
                      value={values.returnDate}
                      onChange={(date) => setFieldValue('returnDate', date)}
                      disablePast
                      minDate={values.departureDate || undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touched.returnDate && !!errors.returnDate,
                          helperText: touched.returnDate && errors.returnDate as string,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Booking...' : 'Book Now'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}