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
import { AddPayment, GetPayment, UpdatePayment } from 'services/paymentServices';
import { openSnackbar } from 'api/snackbar';
import Loader from 'components/Loader';


const getInitialValues = (payment) => {
    const newPriceDate = {
        amount: payment?.attributes?.amount || 0,
        description: payment?.attributes?.description || '',
        InOrOut: true,
        paymentType: payment?.attributes?.payment_type?.data?.id || '',
        payment_type: {},
    };
    return newPriceDate;
};

export default function ReservationPaymentUpdateForm({ closeModal, setIsEdit, id }) {
    const params = useParams();
    const [paymentType, setPaymentType] = useState();
    const [payment, setPayment] = useState([])
    const [loading, setLoading] = useState(true)
    const validationSchema = Yup.object({
        amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        paymentType: Yup.string().max(255).required('Lütfen ödemenin alındığı kasa hesabını seçiniz..')
    });

    useEffect(() => {
        GetAllPaymentTypes().then((res) => {
            setPaymentType(res.data);
            GetPayment(id).then((res) => {
                setPayment(res?.data)
                setLoading(false)
            })
        })

    }, []);

    const formik = useFormik({
        initialValues: getInitialValues(payment),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                values.payment_type = { connect: [values.paymentType.toString()] };

                //console.log(values);


                const data = {
                    data: {
                        ...values
                    }
                }

                UpdatePayment({ data: data, id: id }).then((res) => {
                    if (res?.error) {
                        openSnackbar({
                            open: true,
                            message: res?.error?.message,
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            }
                        });
                    } else {
                        openSnackbar({
                            open: true,
                            message: 'Ödeme Güncellendi.',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    }
                    setIsEdit(true);
                    setSubmitting(false);
                    closeModal();
                })
            } catch (error) {
                console.log("error => ", error);
            }
        }
    });

    if (loading) return <Loader open={loading} />

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


