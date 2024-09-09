/* eslint-disable prettier/prettier */
import { TableContainer, Table, TableRow, TableCell, TableBody, FormControl, Select, MenuItem } from '@mui/material';

// third-party

// project-imports
import MainCard from 'components/MainCard';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import Loader from 'components/Loader';
import { GetReservation, UpdateReservation } from 'services/reservationServices';
import { days } from 'utils/custom/dateHelpers';

export default function ReservationSummarySection() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [reservation, setReservation] = useState([])

    useEffect(() => {
        if (params.id > 0 && loading) {
            GetReservation(params.id).then((res) => {
                console.log("res => ", res.data);
                setReservation(res.data);
                setLoading(false);
            })
        }

    }, [loading])



    const handleReservationStatusChange = (e) => {

        UpdateReservation(params.id, {
            data: {
                reservationStatus: e.target.value.toString()
            }
        }).then(() => {
            setLoading(true);
            openSnackbar({
                open: true,
                message: 'Rezervasyon Durumu Değiştirildi.',
                variant: 'alert',
                alert: {
                    color: 'success'
                }
            });
        });
    };

    if (loading) return (<Loader open={loading} />)
    return (
        <MainCard>
            {reservation &&
                <TableContainer>
                    <Table sx={{ maxWidth: '80%' }} aria-label="simple table">
                        <TableBody>
                            <TableRow hover>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    <b>Rezervasyon Durumu</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    <FormControl fullWidth>
                                        <Select
                                            id="reservationStatus"
                                            value={reservation.attributes.reservationStatus}
                                            onChange={handleReservationStatusChange}
                                        >
                                            <MenuItem value={100}>Onay Bekliyor</MenuItem>
                                            <MenuItem value={110}>İptal Edildi</MenuItem>
                                            <MenuItem value={120}>Onaylandı</MenuItem>
                                            <MenuItem value={130}>Konaklama Başladı</MenuItem>
                                            <MenuItem value={140}>Konaklama Bitti</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5E7D3' }} component="th" scope="row">
                                    <b> GENEL TOPLAM</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5E7D3' }} component="th" scope="row">
                                    : <b>{reservation.attributes.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL </b>
                                </TableCell>
                            </TableRow>
                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    <b>Rezervasyon Numarası</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :<b> {reservation.attributes?.reservationNumber}</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5B82A' }} component="th" scope="row">
                                    <b> YAPILAN ÖDEME</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#F5B82A' }} component="th" scope="row">
                                    :{' '}
                                    <b>
                                        {reservation.attributes.payments?.data.reduce((a, v) => (a = a + v?.attributes.amount), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{' '}
                                        TL
                                    </b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Tesis Adı
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :<b> {reservation.attributes.villa.data !== null ? reservation.attributes.villa.data.attributes.name : reservation.attributes.room.data.attributes.name}</b>
                                </TableCell>

                                <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#83D4A9' }} component="th" scope="row">
                                    <b> KALAN</b>
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer', backgroundColor: '#83D4A9' }} component="th" scope="row">
                                    :{' '}
                                    <b style={{}}>
                                        {(reservation.attributes.total - reservation.attributes.payments?.data.reduce((a, v) => (a = a + v?.attributes.amount),0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{' '}
                                        TL
                                    </b>
                                </TableCell>
                            </TableRow>
                            {/* <TableRow hover>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Ödeme Türü
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :{' '}
                                    <b>
                                        {reservation.attributes.customerPaymentType === '120'
                                            ? 'Admin Tarafında Oluşturuldu'
                                            : reservation.attributes.customerPaymentType === '110'
                                                ? 'Eft/Havale'
                                                : reservation.attributes.customerPaymentType === '100' && 'Kredi Kartı'}
                                    </b>
                                </TableCell>
                            </TableRow> */}
                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Bölge
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{reservation.attributes.villa.data !== null ? reservation.attributes.villa.data.attributes.region : reservation.attributes.room.data.attributes.apart.data.attributes.region }</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Check In
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    :<b> {reservation.attributes.checkIn}</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Check Out
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{reservation.attributes.checkOut}</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Gece Sayısı
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b> {days(reservation.attributes.checkIn, reservation.attributes.checkOut)}</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Toplam
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{reservation.attributes.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    İndirim
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{reservation.attributes.discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</b>
                                </TableCell>
                            </TableRow>

                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Genel Toplam
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{reservation.attributes.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</b>
                                </TableCell>
                            </TableRow>
                            <TableRow hover /*onClick={() => navigate('/villa/show/' + row.id + '/summary')}*/>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    Rezervasyon Notları
                                </TableCell>
                                <TableCell sx={{ pl: 3, cursor: 'pointer' }} component="th" scope="row">
                                    : <b>{reservation.attributes.description} </b>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </MainCard>
    );
}
