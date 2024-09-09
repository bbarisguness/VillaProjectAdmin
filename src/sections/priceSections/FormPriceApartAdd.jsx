/* eslint-disable prettier/prettier */
import { useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';

// project imports
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams } from 'react-router';
import { GetPriceForAddForm, PriceAdd, PricePut, PriceRemove } from 'services/priceServices';


const getInitialValues = () => {
    const newPriceDate = {
        price: '',
        checkIn: '',
        checkOut: '',
        room: {}
    };
    return newPriceDate;
};

export default function FormPriceApartAdd({ closeModal, setIsEdit }) {
    const params = useParams();

    const validationSchema = Yup.object({
        price: Yup.number().required('Fiyat Yazmak Zorunludur')
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {



                formik.values.checkIn = moment(date1).format('YYYY-MM-DD').toString();
                formik.values.checkOut = moment(date2).format('YYYY-MM-DD').toString();
                formik.values.room = { connect: [params.id] };

                GetPriceForAddForm(params.id, values.checkIn, values.checkOut).then((res) => {
                    if (res.data.length > 0) {
                        const priceData = res.data;
                        var firstPrice = priceData[0];
                        var lastPrice = priceData[priceData.length - 1];
                        var endDate = firstPrice.attributes.checkOut;

                        if (firstPrice.attributes.checkIn === values.checkIn && firstPrice.attributes.checkOut === values.checkOut) {
                            //apiRequest('DELETE', `/price-dates/${firstPrice.id}`);
                            PriceRemove(firstPrice.id)
                        } else if (values.checkIn === firstPrice.attributes.checkIn && values.checkOut < firstPrice.attributes.checkOut) {
                            PricePut(firstPrice.id, { data: { checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString() } })

                            // apiRequest('PUT', `price-dates/${firstPrice.id}`, {
                            //     data: { checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString() }
                            // });

                        } else if (values.checkIn > firstPrice.attributes.checkIn && values.checkOut === firstPrice.attributes.checkOut) {
                            // apiRequest('PUT', `price-dates/${firstPrice.id}`, {
                            //     data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() }
                            // });

                            PricePut(firstPrice.id, { data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() } })

                        } else if (values.checkIn > firstPrice.attributes.checkIn && values.checkOut < firstPrice.attributes.checkOut) {

                            PricePut(firstPrice.id, { data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() } })
                            PriceAdd({
                                data: {
                                    checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString(),
                                    checkOut: endDate,
                                    price: firstPrice.attributes.price,
                                    room: { connect: [params.id] }
                                }
                            })

                            // apiRequest('PUT', `price-dates/${firstPrice.id}`, {
                            //     data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() }
                            // });
                            // apiRequest('POST', '/price-dates', {
                            //     data: {
                            //         checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString(),
                            //         checkOut: endDate,
                            //         price: firstPrice.attributes.price,
                            //         villa: { connect: [params.id] }
                            //     }
                            // });
                        } else if (
                            values.checkIn < firstPrice.attributes.checkOut &&
                            values.checkIn > firstPrice.attributes.checkIn &&
                            values.checkOut < lastPrice.attributes.checkOut &&
                            values.checkOut > lastPrice.attributes.checkIn
                        ) {
                            PricePut(firstPrice.id, { data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() } })
                            PricePut(lastPrice.id, { data: { checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString() } })

                            // apiRequest('PUT', `price-dates/${firstPrice.id}`, {
                            //     data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() }
                            // });
                            // apiRequest('PUT', `price-dates/${lastPrice.id}`, {
                            //     data: { checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString() }
                            // });
                        } else if (values.checkIn < firstPrice.attributes.checkOut && values.checkOut > firstPrice.attributes.checkOut) {

                            PricePut(firstPrice.id, { data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() } })

                            // apiRequest('PUT', `price-dates/${firstPrice.id}`, {
                            //     data: { checkOut: moment(values.checkIn).add(-1, 'days').format('YYYY-MM-DD').toString() }
                            // });
                            // dispatch(
                            //     openSnackbar({
                            //         open: true,
                            //         message: 'Fiyat başarıyla eklendi6',
                            //         variant: 'alert',
                            //         alert: {
                            //             color: 'success'
                            //         },
                            //         close: false
                            //     })
                            // );
                        } else if (
                            values.checkIn < firstPrice.attributes.checkIn &&
                            values.checkOut >= firstPrice.attributes.checkIn &&
                            values.checkOut < firstPrice.attributes.checkOut
                        ) {
                            PricePut(firstPrice.id, { data: { checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString() } })

                            // apiRequest('PUT', `price-dates/${firstPrice.id}`, {
                            //     data: { checkIn: moment(values.checkOut).add(1, 'days').format('YYYY-MM-DD').toString() }
                            // });
                        } else if (values.checkIn === firstPrice.attributes.checkOut) {
                            PricePut(firstPrice.id, { data: { checkOut: moment(firstPrice.attributes.checkOut).add(-1, 'days').format('YYYY-MM-DD').toString() } })
                            // apiRequest('PUT', `/price-dates/${firstPrice.id}`, {
                            //     data: { checkOut: moment(firstPrice.attributes.checkOut).add(-1, 'days').format('YYYY-MM-DD').toString() }
                            // });                            
                        }
                    }
                })

                PriceAdd({
                    data: {
                        checkIn: values.checkIn,
                        checkOut: values.checkOut,
                        price: values.price,
                        room: { connect: [params.id] }
                    }
                }).then((res) => {
                    setIsEdit(true);
                    setSubmitting(false);
                    closeModal();
                })


            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { handleSubmit, isSubmitting } = formik;

    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Fiyat Ekle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkIn">Başlangıç Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkIn"
                                                value={date1}
                                                onChange={(newValue) => { setDate1(newValue); }}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkOut">Bitiş Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkOut"
                                                value={date2}
                                                minDate={date1}
                                                disabled={!date1}
                                                onChange={(newValue) => setDate2(newValue)}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="price">Fiyat </InputLabel>
                                            <TextField
                                                fullWidth
                                                id="price"
                                                name="price"
                                                placeholder="Fiyat"
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="end" alignItems="end">
                                <Stack direction="row" spacing={2} alignItems="end">
                                    <Button type="submit" variant="contained" size='large' disabled={isSubmitting}>
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


