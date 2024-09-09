/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';

// project imports
import { useParams } from 'react-router';
import { GetPriceForAddForm, PriceAdd, PricePut, PriceRemove } from 'services/priceServices';
import { GetAllPaymentTypes } from 'services/paymentTypeServices';
import { AddPayment } from 'services/paymentServices';
import { openSnackbar } from 'api/snackbar';


const getInitialValues = () => {
    const newPriceDate = {
        amount: 0,
        description: '',
        InOrOut: true,
        paymentType: '',
        payment_type: {},
        reservation: {},
        villa: {},
        room: {},
        apart: {}
    };
    return newPriceDate;
};

export default function ReservationPaymentAddForm({ closeModal, setIsEdit, facilityId, facilityType, apartId }) {
    const params = useParams();
    const [paymentType, setPaymentType] = useState();
    const validationSchema = Yup.object({
        amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        paymentType: Yup.string().max(255).required('Lütfen ödemenin alındığı kasa hesabını seçiniz..')
    });

    useEffect(() => {
        GetAllPaymentTypes().then((res) => { setPaymentType(res.data); })
    }, []);

    

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                values.reservation = { connect: [params.id] };
                values.payment_type = { connect: [values.paymentType.toString()] };
                if (facilityType === 1) values.villa = { connect: [facilityId] };
                if (facilityType === 2) {
                    values.room = { connect: [facilityId] };
                    values.apart = { connect: [apartId] };
                }

                //console.log(values);


                const data = {
                    ...values
                }

                //console.log({ data });

                AddPayment({ data }).then((res) => {
                    openSnackbar({
                        open: true,
                        message: 'Ödeme Eklendi',
                        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        }
                    });
                    setIsEdit(true);
                    setSubmitting(false);
                    closeModal();
                })
            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    const { handleChange, handleSubmit, isSubmitting } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Ödeme Ekle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount">Amount *</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="amount"
                                            name="amount"
                                            placeholder="Tutar Yazınız.."
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                                            helperText={formik.touched.amount && formik.errors.amount}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="paymentType">Kasa * </InputLabel>{' '}
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-label="paymentType"
                                                value={formik.values.paymentType}
                                                onChange={formik.handleChange}
                                                name="paymentType"
                                                id="paymentType"
                                            >
                                                {paymentType &&
                                                    paymentType.map((item, index) => {
                                                        return (<FormControlLabel key={index} value={item.id} control={<Radio />} label={item.attributes.title} />);
                                                    })}
                                            </RadioGroup>
                                        </FormControl>
                                        {formik.errors.paymentType && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.paymentType}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="description">Description</InputLabel>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <TextField
                                            fullWidth
                                            id="description"
                                            name="description"
                                            placeholder="Açıklama Yazınız.."
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="end" alignItems="end">
                                <Stack direction="row" spacing={2} alignItems="end">
                                    <Button type="submit" variant="contained" size='large'>
                                        KAYDET
                                    </Button>
                                </Stack>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider >
        </>
    );
}


