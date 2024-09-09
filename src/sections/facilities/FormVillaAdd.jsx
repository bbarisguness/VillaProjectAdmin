import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import { Box, Chip, Grid, Stack, Button, Switch, Divider, TextField, InputLabel, Typography, Autocomplete, DialogContent, DialogActions, FormControlLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router';

// assets
import { CloseCircle } from 'iconsax-react';
import { Categories } from 'services/categoryServices';
import 'react-quill/dist/quill.snow.css';
import { VillaAdd } from 'services/villaServices';

// CONSTANT
const getInitialValues = () => {
  const newVilla = {
    slug: '',
    name: '',
    room: 0,
    bath: 0,
    person: 0,
    featureTextRed: '',
    featureTextBlue: '',
    featureTextWhite: '',
    wifiPassword: '',
    waterMaterNumber: '',
    electricityMeterNumber: '',
    internetMeterNumber: '',
    googleMap: '',
    region: '',
    descriptionShort: '',
    descriptionLong: '',
    onlineReservation: false,
    categories: [],
    metaTitle: '',
    metaDescription: '',
    video: ''
  };
  return newVilla;
};

export default function FormVillaAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(false);
    Categories().then((res) => setCategories(res));
  }, []);

  const VillaSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Lütfen villa adı yazınız..'),
    room: Yup.number().moreThan(0, "Oda sayısı 0'dan büyük olmalıdır").required('Oda Sayısı zorunludur'),
    bath: Yup.number().moreThan(0, "Banyo sayısı 0'dan büyük olmalıdır").required('Banyo Sayısı zorunludur'),
    categories: Yup.array().of(Yup.string()).min(1, 'En az bir adet kategori zorunludur.').required('En az bir adet kategori zorunludur.'),
    person: Yup.number().moreThan(0, "Kişi sayısı 0'dan büyük olmalıdır").required('Kişi Sayısı zorunludur'),
    region: Yup.string().max(255).required('Lütfen bölge yazınız..'),
    onlineReservation: Yup.boolean().required('Rezervasyon seçeneği zorunludur')
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: VillaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {

        values.slug = values.name
          .toString()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-');

        const data = {
          data: {
            ...values
          }
        }

        values.categories

        await VillaAdd(data).then((res) => {
          openSnackbar({
            open: true,
            message: 'Yeni Villa Eklendi.',
            variant: 'alert',

            alert: {
              color: 'success'
            }
          });
          setSubmitting(false);
          navigate(`/facilities/villas-show/summary/${res?.data?.id}`);
        });
      } catch (error) {
        // console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );


  const handleChangeEditor = (value) => {
    setFieldValue('descriptionLong', value)
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 2.5 }}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="villa-name">Villa Adı</InputLabel>
                      <TextField
                        fullWidth
                        id="villa-name"
                        placeholder="Villa Adı"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="villa-region">Bölge</InputLabel>
                      <TextField
                        fullWidth
                        id="villa-region"
                        placeholder="Bölge"
                        {...getFieldProps('region')}
                        error={Boolean(touched.region && errors.region)}
                        helperText={touched.region && errors.region}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="categories">Kategori</InputLabel>

                      <Autocomplete
                        id="categories"
                        multiple
                        fullWidth
                        autoHighlight
                        freeSolo
                        disableCloseOnSelect
                        options={categories?.data?.map((item) => item?.attributes?.name) || []}
                        getOptionLabel={(option) => option}
                        onChange={(event, newValue) => {
                          var x = [];
                          categories?.data?.map(function (item) {
                            if (newValue.includes(item.attributes.name)) {
                              x.push(item.id);
                            }
                          });
                          setFieldValue('categories', x);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="categories"
                            placeholder="Kategori Seç"
                            error={touched.categories && Boolean(errors.categories)}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            let error = false;
                            if (touched.categories && errors.categories && typeof errors.categories !== 'string') {
                              if (typeof errors.categories[index] === 'object') error = true;
                            }

                            return (
                              <Chip
                                {...getTagProps({ index })}
                                variant="combined"
                                key={index}
                                label={option}
                                deleteIcon={<CloseCircle style={{ fontSize: '0.75rem' }} />}
                                sx={{ color: 'text.primary' }}
                              />
                            );
                          })
                        }
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-person">Kişi Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-person"
                      placeholder="Kişi Sayısı"
                      {...getFieldProps('person')}
                      error={Boolean(touched.person && errors.person)}
                      helperText={touched.person && errors.person}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-room">Oda Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-room"
                      placeholder="Oda Sayısı"
                      {...getFieldProps('room')}
                      error={Boolean(touched.room && errors.room)}
                      helperText={touched.room && errors.room}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-bath">Banyo Sayısı</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-bath"
                      placeholder="Banyo Sayısı"
                      {...getFieldProps('bath')}
                      error={Boolean(touched.bath && errors.bath)}
                      helperText={touched.bath && errors.bath}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-featureTextRed">Kırmızı Etiket</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-featureTextRed"
                      placeholder="Kırmızı Etiket"
                      {...getFieldProps('featureTextRed')}
                      error={Boolean(touched.featureTextRed && errors.featureTextRed)}
                      helperText={touched.featureTextRed && errors.featureTextRed}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-featureTextBlue">Mavi Etiket</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-featureTextBlue"
                      placeholder="Mavi Etiket"
                      {...getFieldProps('featureTextBlue')}
                      error={Boolean(touched.featureTextBlue && errors.featureTextBlue)}
                      helperText={touched.featureTextBlue && errors.featureTextBlue}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputLabel htmlFor="villa-featureTextWhite">Beyaz Etiket</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-featureTextWhite"
                      placeholder="Beyaz Etiket"
                      {...getFieldProps('featureTextWhite')}
                      error={Boolean(touched.featureTextWhite && errors.featureTextWhite)}
                      helperText={touched.featureTextWhite && errors.featureTextWhite}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-wifiPassword">Wifi Şifresi</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-wifiPassword"
                      placeholder="Wifi Şifresi"
                      {...getFieldProps('wifiPassword')}
                      error={Boolean(touched.wifiPassword && errors.wifiPassword)}
                      helperText={touched.wifiPassword && errors.wifiPassword}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-waterMaterNumber">Su Fatura Numarası</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-waterMaterNumber"
                      placeholder="Su Fatura Numarası"
                      {...getFieldProps('waterMaterNumber')}
                      error={Boolean(touched.waterMaterNumber && errors.waterMaterNumber)}
                      helperText={touched.waterMaterNumber && errors.waterMaterNumber}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-electricityMeterNumber">Elektrik Fatura Numarası</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-electricityMeterNumber"
                      placeholder="Elektrik Fatura Numarası"
                      {...getFieldProps('electricityMeterNumber')}
                      error={Boolean(touched.electricityMeterNumber && errors.electricityMeterNumber)}
                      helperText={touched.electricityMeterNumber && errors.electricityMeterNumber}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-internetMeterNumber">İnternet Fatura Numarası</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-internetMeterNumber"
                      placeholder="İnternet Fatura Numarası"
                      {...getFieldProps('internetMeterNumber')}
                      error={Boolean(touched.internetMeterNumber && errors.internetMeterNumber)}
                      helperText={touched.internetMeterNumber && errors.internetMeterNumber}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel htmlFor="descriptionShort">Kısa Açıklama</InputLabel>
                    <TextField
                      fullWidth
                      id="descriptionShort"
                      multiline
                      rows={5}
                      placeholder="Kısa Açıklama"
                      {...getFieldProps('descriptionShort')}
                      error={Boolean(touched.descriptionShort && errors.descriptionShort)}
                      helperText={touched.descriptionShort && errors.descriptionShort}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel htmlFor="longDescription">Genel Açıklama</InputLabel>
                    <ReactQuill style={{ height: '400px', marginBottom: '40px' }} onChange={handleChangeEditor} />
                  </Grid>



                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-metaTitle">Seo Meta Title</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-metaTitle"
                      placeholder="Meta Başlık"
                      {...getFieldProps('metaTitle')}
                      error={Boolean(touched.metaTitle && errors.metaTitle)}
                      helperText={touched.metaTitle && errors.metaTitle}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-metaDescription">Seo Meta Description</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-metaDescription"
                      placeholder="Meta Açıklama"
                      {...getFieldProps('metaDescription')}
                      error={Boolean(touched.metaDescription && errors.metaDescription)}
                      helperText={touched.metaDescription && errors.metaDescription}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-video">Video</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-video"
                      placeholder="Video"
                      {...getFieldProps('video')}
                      error={Boolean(touched.video && errors.video)}
                      helperText={touched.video && errors.video}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel htmlFor="villa-googleMap">Google Map</InputLabel>
                    <TextField
                      fullWidth
                      id="villa-googleMap"
                      placeholder="Google Map"
                      {...getFieldProps('googleMap')}
                      error={Boolean(touched.googleMap && errors.googleMap)}
                      helperText={touched.googleMap && errors.googleMap}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Online Reservation Status</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tesisinize Online (Anlık) Rezervasyon Kabul Ediyormusunuz?
                    </Typography>
                    <FormControlLabel control={<Switch sx={{ mt: 0 }} />} label="" labelPlacement="start" onChange={() => { setFieldValue('onlineReservation', !getFieldProps('onlineReservation').value) }} />
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="end" alignItems="end">
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="end">
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      KAYDET
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
}