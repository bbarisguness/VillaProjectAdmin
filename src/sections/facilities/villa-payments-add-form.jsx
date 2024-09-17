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
import Loader from 'components/Loader';


const getInitialValues = () => {
    const newPriceDate = {
        amount: 0,
        description: '',
        InOrOut: false,
        paymentType: '',
        payment_type: {},
        reservation: {},
        villa: {},
        room: {},
        apart: {}
    };
    return newPriceDate;
};

export default function VillaPaymentAddForm({ closeModal, setIsEdit, apart, villa, room }) {
    const [loading, setLoading] = useState(true)
    const params = useParams();
    const [paymentType, setPaymentType] = useState();
    const validationSchema = Yup.object({
        amount: Yup.number().min(1).required('Lütfen tutar yazınız..'),
        paymentType: Yup.string().max(255).required('Lütfen ödemenin alındığı kasa hesabını seçiniz..')
    });

    useEffect(() => {
        GetAllPaymentTypes().then((res) => { setPaymentType(res.data); setLoading(false) })
    }, []);



    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const fd = new FormData()
                fd.append('Amount', values.amount)
                fd.append('Description', values.description)
                fd.append('PaymentTypeId', values.paymentType)
                if (apart) {
                    fd.append('HotelId', params.id)
                } else if (villa) {
                    fd.append('VillaId', params.id)
                } else if (room) {
                    fd.append('RoomId', params.id)
                }
                fd.append('InOrOut', values.InOrOut)

                await AddPayment(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Ödeme Eklendi',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    } else {
                        openSnackbar({
                            open: true,
                            message: 'Hata',
                            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                            variant: 'alert',
                            alert: {
                                color: 'error'
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

    const { handleChange, handleSubmit, isSubmitting } = formik;

    if (loading) return <Loader open={loading} />

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
                                                        return (<FormControlLabel key={index} value={item.id} control={<Radio />} label={item.title} />);
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
                                        <InputLabel htmlFor="InOrOut">Tür * </InputLabel>{' '}
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <Stack spacing={1}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-label="InOrOut"
                                                value={formik.values.InOrOut}
                                                onChange={formik.handleChange}
                                                name="InOrOut"
                                                id="InOrOut"
                                            >
                                                <FormControlLabel value={false} control={<Radio />} label={'Gider'} />
                                                <FormControlLabel value={true} control={<Radio />} label={'Gelir'} />
                                            </RadioGroup>
                                        </FormControl>
                                        {formik.errors.InOrOut && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.InOrOut}
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


