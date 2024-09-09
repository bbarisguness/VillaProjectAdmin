/* eslint-disable prettier/prettier */
// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Loader from 'components/Loader';

// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { GetAllReservationItems } from 'services/reservationItemServices';
import { GetAvailibleDate } from 'services/reservationServices';
import { dateToString, days } from 'utils/custom/dateHelpers';

export const header = [
    { label: 'Tarih', key: 'name' },
    { label: 'Fiyat', key: 'fat' }
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function ReservationPriceDetailSection() {
    const params = useParams();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    let today = new Date();

    useEffect(() => {
        setLoading(false);
        GetAllReservationItems(params.id).then((res) => { setData(res.data); setLoading(false); })
    }, [])
    if (loading) return (<Loader open={loading} />)
    return (
        <MainCard content={false} title="">
            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Tarih</TableCell>
                            <TableCell align="left">Fiyat</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {data && data.map((item,index) => {
                            return (<TableRow hover key={index}>
                                <TableCell align="left">{item.attributes.day}</TableCell>
                                <TableCell align="left">{item.attributes.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL</TableCell>
                            </TableRow>);
                        }
                        )}

                    </TableBody>
                </Table>
            </TableContainer >
        </MainCard >
    );
}
