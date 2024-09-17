/* eslint-disable prettier/prettier */
import { useMediaQuery, Grid, Stack, List, ListItem, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { GetApartFull } from 'services/apartServices';
import { useParams } from 'react-router';
import Loader from 'components/Loader';
import { Add, Edit, Trash } from 'iconsax-react';
import DistanceRulerModal from 'sections/distanceRulerSections/DistanceRulerModal';
import DistanceRulerModalDelete from 'sections/distanceRulerSections/DistanceRulerModalDelete';
import PriceTableModalDelete from 'sections/priceTableSections/PriceTableModalDelete';
import PriceTableModal from 'sections/priceTableSections/PriceTableModal';
import { GetDistanceRulerApart } from 'services/distanceRulerServices';
import { GetPriceTableApart } from 'services/priceTableServices';
import PriceTableUpdateModal from 'sections/priceTableSections/PriceTableUpdateModal';
import DistanceRulerUpdateModal from 'sections/distanceRulerSections/DistanceRulerUpdateModal';

export default function ApartContentSection() {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const params = useParams();
    const [villa, setVilla] = useState();
    const [loading, setLoading] = useState(true);

    const [distanceRuler, setDistanceRuler] = useState([])
    const [priceTable, setPriceTable] = useState([])

    const [distanceRulerModal, setDistanceRulerModal] = useState(false)
    const [distanceRulerModalDelete, setDistanceRulerModalDelete] = useState(false);
    const [selectedDistanceDeleteItem, setSelectedDistanceDeleteItem] = useState([])

    const [priceTableModal, setPriceTableModal] = useState(false)
    const [priceTableModalDelete, setPriceTableModalDelete] = useState(false);
    const [selectedPriceDeleteItem, setSelectedPriceDeleteItem] = useState([])

    const [updatePriceTableModal, setUpdatePriceTableModal] = useState(false)
    const [selectedPriceTableItem, setSelectedPriceTableItem] = useState([])

    const [updateDistanceRulerModal, setUpdateDistanceRulerModal] = useState(false)
    const [selectedDistanceRulerItem, setSelectedDistanceRulerItem] = useState('')

    const [isEdit, setIsEdit] = useState(true);
    const [distanceRulerDeleteId, setDistanceRulerDeleteId] = useState('');
    const [priceTableDeleteId, setPriceTableDeleteId] = useState('');


    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            GetDistanceRulerApart(params.id).then((res) => {
                setDistanceRuler(res?.data)
            })
            GetPriceTableApart(params.id).then((res) => {
                setPriceTable(res.data);
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
            <Grid item xs={12}>
                <Grid container spacing={3}>

                    {true && (
                        <>
                            <Grid item xs={12}>
                                <MainCard content={false} title="MESAFE CETVELİ" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setDistanceRulerModal(true) }} size="large">
                                        Mesafe Ekle
                                    </Button>}>
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
                                                {
                                                    distanceRuler && distanceRuler.map((item, i) => {
                                                        return (
                                                            <TableRow hover key={i}>
                                                                <TableCell align="left">{item.distanceRulerDetails[0].name}</TableCell>
                                                                <TableCell align="left">{item.distanceRulerDetails[0].value}</TableCell>
                                                                <TableCell sx={{ pr: 3 }} align="right">
                                                                    <Stack direction="row" spacing={0}>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                color="error"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleClose();
                                                                                    setDistanceRulerDeleteId(item.id);
                                                                                    setSelectedDistanceDeleteItem(item)
                                                                                }}
                                                                            >
                                                                                <Trash />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Edit">
                                                                            <IconButton
                                                                                color="primary"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setUpdateDistanceRulerModal(true)
                                                                                    setSelectedDistanceRulerItem(item)
                                                                                }}
                                                                            >
                                                                                <Edit />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <DistanceRulerModal apart={true} open={distanceRulerModal} modalToggler={setDistanceRulerModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <DistanceRulerModalDelete selectedItem={selectedDistanceDeleteItem} setIsEdit={setIsEdit} id={distanceRulerDeleteId} title={distanceRulerDeleteId} open={distanceRulerModalDelete} handleClose={handleClose} />
                                    <DistanceRulerUpdateModal open={updateDistanceRulerModal} modalToggler={setUpdateDistanceRulerModal} selectedItem={selectedDistanceRulerItem} setIsEdit={setIsEdit} />
                                </MainCard>
                            </Grid>
                            <Grid item xs={12}>
                                <MainCard content={false} title="Fiyat Tablosu" secondary={
                                    <Button variant="contained" startIcon={<Add />} onClick={() => { setPriceTableModal(true) }} size="large">
                                        Fiyat Ekle
                                    </Button>}>

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
                                                {
                                                    priceTable && priceTable.map((item,i) => {
                                                        return (
                                                            <TableRow hover key={i}>
                                                                <TableCell align="left">{item.priceTableDetails[0].title}</TableCell>
                                                                <TableCell align="left">{item.priceTableDetails[0].description}</TableCell>
                                                                <TableCell align="left">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</TableCell>
                                                                <TableCell sx={{ pr: 3 }} align="right">
                                                                    <Stack direction="row" spacing={0}>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                color="error"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleClosePriceTable();
                                                                                    setPriceTableDeleteId(item.id);
                                                                                    setSelectedPriceDeleteItem(item)
                                                                                }}
                                                                            >
                                                                                <Trash />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Edit">
                                                                            <IconButton
                                                                                color="primary"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setUpdatePriceTableModal(true)
                                                                                    setSelectedPriceTableItem(item)
                                                                                }}
                                                                            >
                                                                                <Edit />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <PriceTableModal apart={true} open={priceTableModal} modalToggler={setPriceTableModal} villaId={params.id} setIsEdit={setIsEdit} />
                                    <PriceTableUpdateModal apart={true} open={updatePriceTableModal} modalToggler={setUpdatePriceTableModal} selectedItem={selectedPriceTableItem} setIsEdit={setIsEdit} />
                                    <PriceTableModalDelete selectedItem={selectedPriceDeleteItem} setIsEdit={setIsEdit} id={priceTableDeleteId} title={priceTableDeleteId} open={priceTableModalDelete} handleClose={handleClosePriceTable} />
                                </MainCard>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid >
    );
}