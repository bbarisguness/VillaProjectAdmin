/* eslint-disable prettier/prettier */
import { useMediaQuery, Grid, Stack, List, ListItem, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { GetVilla, GetVillaFull } from 'services/villaServices';
import { useParams } from 'react-router';
import Loader from 'components/Loader';
import { Add, Trash } from 'iconsax-react';
import DistanceRulerModal from 'sections/distanceRulerSections/DistanceRulerModal';
import DistanceRulerModalDelete from 'sections/distanceRulerSections/DistanceRulerModalDelete';
import PriceTableModalDelete from 'sections/priceTableSections/PriceTableModalDelete';
import PriceTableModal from 'sections/priceTableSections/PriceTableModal';

export default function VillaContentSection() {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const params = useParams();
    const [villa, setVilla] = useState();
    const [loading, setLoading] = useState(true);

    const [distanceRulerModal, setDistanceRulerModal] = useState(false)
    const [distanceRulerModalDelete, setDistanceRulerModalDelete] = useState(false);
    const [selectedDistanceDeleteItem, setSelectedDistanceDeleteItem] = useState([])

    const [priceTableModal, setPriceTableModal] = useState(false)
    const [priceTableModalDelete, setPriceTableModalDelete] = useState(false);
    const [selectedPriceDeleteItem, setSelectedPriceDeleteItem] = useState([])

    const [isEdit, setIsEdit] = useState(true);
    const [distanceRulerDeleteId, setDistanceRulerDeleteId] = useState('');
    const [priceTableDeleteId, setPriceTableDeleteId] = useState('');

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            GetVillaFull(params.id).then((res) => {
                setVilla(res.data);
                setLoading(false);
                setIsEdit(false);
            })
        }
    }, [isEdit])

    const handleClose = () => {
        setDistanceRulerModalDelete(!distanceRulerModalDelete);
    };

    const handleClosePriceTable = () => {
        setPriceTableModalDelete(!priceTableModalDelete);
    };
    if (loading) return (<Loader open={loading} />)

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={7} md={8} xl={12}>
                <Grid container spacing={3}>

                    {villa && (
                        <>
                            {/* <Grid item xs={12}>
                                <MainCard title="Genel İçerikler">
                                    <List sx={{ py: 0 }}>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Bölge : {villa.attributes.region} </Typography>

                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Online Rezervasayon : {villa.attributes.onlineReservation == 'true' ? 'Aktif' : 'Pasif'}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Kapasite : {villa.attributes.person}</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Meta Title : {villa.attributes.metaTitle}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Oda Sayısı : {villa.attributes.room}</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Meta Description : {villa.attributes.metaDescription}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Banyo : {villa.attributes.bath}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Kırmızı Etiket : {villa.attributes.featureTextRed}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Mavi Etiket : {villa.attributes.featureTextBlue}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary" fontWeight={500}>Beyaz Etiket : {villa.attributes.featureTextWhite}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </List>
                                </MainCard>
                            </Grid> */}
                            <Grid item xs={12}>
                                <MainCard content={false} title="MESAFE CETVELİ" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setDistanceRulerModal(true) }} size="large">
                                        Mesafe Ekle
                                    </Button>}>
                                    {/* table */}
                                    <TableContainer>
                                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Başlık</TableCell>
                                                    <TableCell align="left">Mesafe</TableCell>
                                                    <TableCell align="right" sx={{ pr: 3 }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {villa && villa.attributes.distance_rulers.data.map((row) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell align="left">{row.attributes.name}</TableCell>
                                                        <TableCell align="left">{row.attributes.value}</TableCell>
                                                        <TableCell sx={{ pr: 3 }} align="right">
                                                            <Stack direction="row" spacing={0}>
                                                                <Tooltip title="Delete">
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleClose();
                                                                            setDistanceRulerDeleteId(Number(row.id));
                                                                            setSelectedDistanceDeleteItem(row.attributes)
                                                                        }}
                                                                    >
                                                                        <Trash />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <DistanceRulerModal open={distanceRulerModal} modalToggler={setDistanceRulerModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <DistanceRulerModalDelete selectedItem={selectedDistanceDeleteItem} setIsEdit={setIsEdit} id={Number(distanceRulerDeleteId)} title={distanceRulerDeleteId} open={distanceRulerModalDelete} handleClose={handleClose} />
                                </MainCard>
                            </Grid>
                            <Grid item xs={12}>
                                <MainCard content={false} title="Fiyat Tablosu" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setPriceTableModal(true) }} size="large">
                                        Fiyat Ekle
                                    </Button>}>
                                    {/* table */}
                                    <TableContainer>
                                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Başlık</TableCell>
                                                    <TableCell align="left">Açıklama</TableCell>
                                                    <TableCell align="left">Fiyat</TableCell>
                                                    <TableCell align="right" sx={{ pr: 3 }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {villa && villa.attributes.price_tables.data.map((row) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell align="left">{row.attributes.name}</TableCell>
                                                        <TableCell align="left">{row.attributes.description}</TableCell>
                                                        <TableCell align="left">{row.attributes.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</TableCell>
                                                        <TableCell sx={{ pr: 3 }} align="right">
                                                            <Stack direction="row" spacing={0}>
                                                                <Tooltip title="Delete">
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleClosePriceTable();
                                                                            setPriceTableDeleteId(Number(row.id));
                                                                            setSelectedPriceDeleteItem(row.attributes)
                                                                        }}
                                                                    >
                                                                        <Trash />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <PriceTableModal open={priceTableModal} modalToggler={setPriceTableModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <PriceTableModalDelete selectedItem={selectedPriceDeleteItem} setIsEdit={setIsEdit} id={Number(priceTableDeleteId)} title={priceTableDeleteId} open={priceTableModalDelete} handleClose={handleClosePriceTable} />
                                </MainCard>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid >
    );
}