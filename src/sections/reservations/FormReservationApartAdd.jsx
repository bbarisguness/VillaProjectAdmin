/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from 'moment';


// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertCustomer, updateCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import { VillaGetPriceForReservation, VillaIsAvailible } from 'services/villaServices';
import { dateToString } from 'utils/custom/dateHelpers';
import { useNavigate, useParams } from 'react-router';
import Loader from 'components/Loader';
import { AddReservation, AddReservationItem } from 'services/reservationServices';
import { AddReservationInfo } from 'services/reservationInfoServices';
import { RoomGetPriceForReservation, RoomIsAvailible } from 'services/roomServices';



// CONSTANT
const getInitialValues = () => {
    const newReservation = {
        name: '',
        surname: '',
        idNo: '',
        phone: '',
        email: '',
        checkIn: '',
        checkOut: '',
        discount: 0,
        total: 0,
        room: {},
        amount: 0,
        reservationStatus: '',
        customerPaymentType: '',
        description: '',
        reservation_infos: {},
        homeOwner: false
    };


    return newReservation;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormReservationApartAdd({ roomId, closeModal, setIsAdded }) {
    const theme = useTheme();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [reservationItem, setReservationItem] = useState([]);


    useEffect(() => {
        setLoading(false);
    }, []);

    const ReservationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        surname: Yup.string().required('Surname is required'),
        idNo: Yup.string().required('Tc Kimlik is required'),
        email: Yup.string().email('Enter a valid email')
    });

    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        closeModal();
    };

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: ReservationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                setLoading(true);

                formik.values.checkIn = moment(date1).format('YYYY-MM-DD').toString();
                formik.values.checkOut = moment(date2).format('YYYY-MM-DD').toString();

                const fd = new FormData()
                fd.append('RoomId', params.id)
                fd.append('CheckIn', formik.values.checkIn)
                fd.append('CheckOut', formik.values.checkOut)
                fd.append('Discount', formik.values.discount)
                fd.append('ReservationChannalType', 1)
                fd.append('ReservationStatusType', 1)
                fd.append('IsDepositPrice', false)
                fd.append('IsCleaningPrice', false)
                fd.append('HomeOwner', false)
                fd.append('PriceType', 1)
                fd.append('IdNo', formik.values.idNo)
                fd.append('Name', formik.values.name)
                fd.append('Surname', formik.values.surname)
                fd.append('Phone', formik.values.phone)
                fd.append('Email', formik.values.email)

                await AddReservation(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Rezervasyon oluşturuldu.',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                        navigate(`/reservations/show/summary/${res.data.id}`);
                    } else {
                        openSnackbar({
                            open: true,
                            message: res?.message ? res?.message : 'Hata',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            }
                        });
                    }
                    setLoading(false);
                    setSubmitting(false);
                    closeModal();
                })
            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);


    const handleAvailible = () => {
        setLoading(true)
        if (date1 && date2) {
            if (new Date(date1) >= new Date(date2)) {
                openSnackbar({
                    open: true,
                    message: 'Lütfen Tarihleri Kontrol Ediniz.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
                setLoading(false)
                return;
            }
            RoomGetPriceForReservation(params.id, dateToString(date1), dateToString(date2)).then((res) => {
                if (res.statusCode === 400) {
                    openSnackbar({
                        open: true,
                        message: res.message,
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    });
                    setLoading(false);
                }
                var fakeDate = new Date(moment(date1).format('YYYY-MM-DD'));
                var days = [];
                res.data.days.map((priceDate) => {
                    while (fakeDate >= new Date(res.data.checkIn) && fakeDate <= new Date(res.data.checkOut)) {
                        if (fakeDate >= new Date(moment(date2).format('YYYY-MM-DD'))) break;
                        days.push({ date: moment(fakeDate).format('YYYY-MM-DD'), price: priceDate.price });
                        fakeDate.setDate(fakeDate.getDate() + 1);
                    }
                });
                var toplam = 0;
                var rezItem = [];
                for (var i = 0; i < days.length; i++) {
                    toplam = toplam + Number(days[i].price);
                    rezItem.push({ day: days[i].date, price: days[i].price });
                }
                setReservationItem(rezItem);

                let time1 = date1.getTime();
                let time2 = date2.getTime();

                let timeDifference = Math.abs(time2 - time1);
                let dayDifference = timeDifference / (1000 * 60 * 60 * 24);

                if (toplam > 0 && (rezItem.length === parseInt(dayDifference))) {
                    setFieldValue('amount', toplam);
                    setIsAvailable(true);
                    setLoading(false);
                } else {
                    openSnackbar({
                        open: true,
                        message: 'Seçtiğiniz tarihlerde fiyat bilgisi bulunamadı.',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    });
                    setLoading(false);
                }
            })
        }
        else {
            openSnackbar({
                open: true,
                message: 'Lütfen Tarih Seçiniz.',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            });
            setLoading(false)
        }
    };

    const handleHomeOwner = () => {
        setLoading(true)
        if (date1 && date2) {
            if (new Date(date1) >= new Date(date2)) {
                openSnackbar({
                    open: true,
                    message: 'Lütfen Tarihleri Kontrol Ediniz.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
                setLoading(false)
                return;
            } else {
                const fd = new FormData()
                fd.append('RoomId', params.id)
                fd.append('CheckIn', moment(date1).format('YYYY-MM-DD').toString())
                fd.append('CheckOut', moment(date2).format('YYYY-MM-DD').toString())
                fd.append('HomeOwner', true)

                AddReservation(fd).then((res) => {
                    if (res?.statusCode === 200) {
                        openSnackbar({
                            open: true,
                            message: 'Rezervasyon oluşturuldu.',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                    } else {
                        openSnackbar({
                            open: true,
                            message: res?.message ? res?.message : 'Hata',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            }
                        });
                    }
                    setLoading(false);
                    setIsAdded(true)
                    closeModal();
                });
            }
        }
        else {
            openSnackbar({
                open: true,
                message: 'Lütfen Tarih Seçiniz.',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            });
            setLoading(false)
        }
    }

    if (loading)
        return (
            <Box sx={{ p: 5 }}>
                <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                </Stack>
            </Box>
        );

    if (loading) return (<Loader open={loading} />)

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Rezervasyon Ekle</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid item xs={12} md={12}>


                                {!isAvailable ? <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkIn">Giriş Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkIn"
                                                value={date1}
                                                onChange={(newValue) => { setDate1(newValue); }}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="checkOut">Çıkış Tarihi</InputLabel>
                                            <DatePicker
                                                id="checkOut"
                                                value={date2}
                                                minDate={date1}
                                                disabled={!date1}
                                                onChange={(newValue) => setDate2(newValue)}
                                                slotProps={{ textField: { fullWidth: true } }} />
                                        </Stack>
                                    </Grid>
                                </Grid> :

                                    <Grid container spacing={3}>

                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="İndirim">İndirim </InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="discount"
                                                    name="discount"
                                                    placeholder="İndirim Uygula"
                                                    value={formik.values.discount}
                                                    onChange={formik.handleChange}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider />
                                            <Stack direction="row" spacing={2} alignItems="center">

                                                {isAvailable && (
                                                    <Button color="warning" size="large" onClick={() => null}>
                                                        Toplam Fiyat : {formik?.values?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL
                                                    </Button>
                                                )}
                                                {isAvailable && (
                                                    <Button size="large" onClick={() => null}>
                                                        İndirimli Fiyat : {(formik?.values?.amount - formik?.values?.discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL
                                                    </Button>
                                                )}
                                            </Stack>
                                            <Divider />
                                        </Grid>



                                        <Grid item xs={6}>
                                            <Stack spacing={1}>

                                                <InputLabel htmlFor="checkIn">Adı *</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="name"
                                                    name="name"
                                                    placeholder="Rezervasyon Sahibi Adı"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    error={Boolean(touched.name && errors.name)}
                                                    helperText={touched.name && errors.name}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="checkIn">Soyadı *</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="surname"
                                                    name="surname"
                                                    placeholder="Rezervasyon Sahibi Adı"
                                                    value={formik.values.surname}
                                                    onChange={formik.handleChange}
                                                    error={Boolean(touched.surname && errors.surname)}
                                                    helperText={touched.surname && errors.surname}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="TcKimlik">Tc Kimlik *</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="idNo"
                                                    name="idNo"
                                                    placeholder="Rezervasyon Sahibi Tc Kimlik"
                                                    value={formik.values.idNo}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.idNo && Boolean(formik.errors.idNo)}
                                                    helperText={formik.touched.idNo && formik.errors.idNo}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="Telefon Numarası">Telefon Numarası</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="Rezervasyon Sahibi Telefon Numarası"
                                                    value={formik.values.phone}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                                    helperText={formik.touched.phone && formik.errors.phone}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="email">Email Adresi</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="email"
                                                    name="email"
                                                    placeholder="Enter email address"
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                                    helperText={formik.touched.email && formik.errors.email}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="description">Rezervasyon Notları</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="description"
                                                    name="description"
                                                    multiline
                                                    rows={5}
                                                    placeholder="Rezervasyon Notları"
                                                    value={formik.values.description}
                                                    onChange={formik.handleChange}
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                }


                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="space-between" alignItems="normal">
                                {!isAvailable ? <><Stack direction="row" spacing={2} alignItems="start">
                                    <Button type="button" variant="contained" color='primary' size='large' onClick={handleHomeOwner}>
                                        EV SAHİBİ
                                    </Button>
                                </Stack>
                                    <Stack direction="row" spacing={2} alignItems="end">
                                        <Button type="button" variant="contained" color='warning' size='large' onClick={handleAvailible}>
                                            FİYAT SORGULA
                                        </Button>
                                    </Stack></> : <Stack direction="row" spacing={2} alignItems="end">
                                    <Button type="submit" variant="contained" size='large' disabled={isSubmitting}>
                                        REZERVASYON OLUŞTUR
                                    </Button>
                                </Stack>}
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider >
        </>
    );
}

FormReservationApartAdd.propTypes = { roomId: PropTypes.any, closeModal: PropTypes.func };
