/* eslint-disable prettier/prettier */
import { useState } from 'react';

// material ui
import { Grid, Stack, Button, Divider, TextField, InputLabel, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

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
import { DistanceRulerAdd } from 'services/distanceRulerServices';
import { openSnackbar } from 'api/snackbar';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import { PhotoPost, Upload } from 'services/photoService';
import Loader from 'components/Loader';


const getInitialValues = () => {
    const newDistanceRuler = {
        files: null,
        villa: {}
    };
    return newDistanceRuler;
};

export default function FormPhotoAdd({ closeModal, setIsEdit, lastLine, setLoading, apart = false, room = false }) {
    const params = useParams();

    const [uploadLoading, setUploadLoading] = useState(false);

    const validationSchema = Yup.object({
        files: Yup.mixed().required('Lütfen Resim Seçiniz.')
    });

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let fd = new FormData();
                formik.values.files.forEach((file) => { fd.append('files', file); });
                var indexLenght = 0;

                setUploadLoading(true);
                Upload(fd).then((res) => {

                    res.map((img, index) => {
                        let imgJson = {}
                        if (apart) {
                            imgJson = {
                                data: {
                                    name: img.name,
                                    line: (lastLine && lastLine + (index + 1)) || (index + 1),
                                    photo: img.id,
                                    apart: { connect: [params.id] }
                                }
                            };
                        } else if (room) {
                            imgJson = {
                                data: {
                                    name: img.name,
                                    line: (lastLine && lastLine + (index + 1)) || (index + 1),
                                    photo: img.id,
                                    room: { connect: [params.id] }
                                }
                            };
                        }
                        else {
                            imgJson = {
                                data: {
                                    name: img.name,
                                    line: (lastLine && lastLine + (index + 1)) || (index + 1),
                                    photo: img.id,
                                    villa: { connect: [params.id] }
                                }
                            };
                        }


                        PhotoPost(imgJson).then((ress) => {
                            indexLenght = index + 1;
                            if (res.length === indexLenght) {
                                openSnackbar({
                                    open: true,
                                    message: 'Resimler Eklendi',
                                    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                                    variant: 'alert',
                                    alert: {
                                        color: 'success'
                                    }
                                });
                                setSubmitting(false);
                                setIsEdit(true);
                                setLoading(true);
                                setUploadLoading(false)
                                closeModal();
                            }
                        });

                    });

                });


            } catch (error) {
                // console.error(error);
            }
        }
    });

    const { values, handleSubmit, setFieldValue, touched, errors, isSubmitting } = formik;
    const [list, setList] = useState(false);

    if (uploadLoading) return (<Loader open={uploadLoading} />)

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>Resim Yükle</DialogTitle>
                        <Divider />

                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1.5} alignItems="center">
                                        <UploadMultiFile
                                            showList={list}
                                            setFieldValue={setFieldValue}
                                            files={values.files}
                                            error={touched.files && !!errors.files}
                                        />
                                    </Stack>
                                    {touched.files && errors.files && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.files}
                                        </FormHelperText>
                                    )}
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


