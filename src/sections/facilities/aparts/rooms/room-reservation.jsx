/* eslint-disable prettier/prettier */
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Typography, Box, FormControlLabel, Switch, } from '@mui/material';

// third-party
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import { DebouncedInput, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add } from 'iconsax-react';

// custom
import { ReservationServices } from 'services';
import Loader from 'components/Loader';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ReservationModal from 'sections/reservations/ReservationModal';
import { GetReservations } from 'services/roomServices';
import ReservationApartModal from 'sections/reservations/ReservationApartModal';

const fallbackData = [];
function ReactTable({ data, columns, modalToggler, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, showAllReservation, setShowAllReservation }) {

    const navigate = useNavigate();


    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        pageCount: data?.meta?.pagination?.pageCount || 1,
        autoResetPageIndex: false,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        debugTable: true
    });

    let headers = [];
    columns.map(
        (columns) =>
            // @ts-ignore
            columns.accessorKey &&
            headers.push({
                label: typeof columns.header === 'string' ? columns.header : '#',
                // @ts-ignore
                key: columns.accessorKey
            })
    );

    return (
        <MainCard content={false}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    disabled={showAllReservation}
                    onFilterChange={(value) => setGlobalFilter(String(value))}
                    placeholder={`Search ${data?.meta?.pagination?.total} records...`}
                />

                <Stack direction="row" alignItems="center" spacing={2}>
                    <FormControlLabel style={{ position: 'relative', top: '5px' }} control={<Switch sx={{ mt: 0 }} />} label={<p style={{ position: 'relative', top: '-4px' }}>Tüm rezervasyonlar</p>} labelPlacement="start" checked={showAllReservation} onChange={() => setShowAllReservation(!showAllReservation)} />
                    <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
                        Rezervasyon Ekle
                    </Button>
                </Stack>
            </Stack>
            <ScrollX>
                <Stack>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                                                Object.assign(header.column.columnDef.meta, {
                                                    className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                                                });
                                            }

                                            return (
                                                <TableCell
                                                    key={header.id}
                                                    {...header.column.columnDef.meta}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    {...(header.column.getCanSort() &&
                                                        header.column.columnDef.meta === undefined && {
                                                        className: 'cursor-pointer prevent-select'
                                                    })}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                                            {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                                        </Stack>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => {
                                            console.log("Kayıt Id => ", row.original.id);
                                            navigate(`/reservations/show/summary/${row.original.id}`)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                            <TablePagination
                                {...{
                                    setPageSize: table.setPageSize,
                                    setPageIndex: table.setPageIndex,
                                    getState: table.getState,
                                    getPageCount: table.getPageCount,
                                    initialPageSize: pagination.pageSize
                                }}
                            />
                        </Box>
                    </>
                </Stack>
            </ScrollX>
        </MainCard>
    );
}

export default function RoomReservationSection() {
    const theme = useTheme();
    const params = useParams();

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [reservationModal, setReservationModal] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false)
    const [showAllReservation, setShowAllReservation] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        GetReservations(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter, params.id, showAllReservation).then((res) => { setData(res); setLoading(false); });
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, showAllReservation]);


    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter, showAllReservation])

    useEffect(() => {
        if (isDeleted || isAdded) {
            setIsDeleted(false)
            setIsAdded(false)
            setLoading(true)
            //ReservationServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
            GetReservations(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter, params.id, showAllReservation).then((res) => { setLoading(false); setData(res) })
        }
    }, [isDeleted, isAdded])

    const columns = useMemo(
        () => [
            {
                header: '#',
                cell: ({ row }) => { return row.original.id }
            },
            {
                header: 'Misafir',
                cell: ({ row }) => {
                    return (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar
                                alt="Avatar"
                                size="sm"
                                src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
                            />
                            <Stack spacing={0}>
                                <Typography variant="subtitle1">{`${row?.original?.attributes?.reservation_infos?.data[0]?.attributes?.name ? row?.original?.attributes?.reservation_infos?.data[0]?.attributes?.name : 'Ev Sahibi'} ${row?.original?.attributes?.reservation_infos?.data[0]?.attributes?.surname ? row?.original?.attributes?.reservation_infos?.data[0]?.attributes?.surname : ''}`}</Typography>
                            </Stack>
                        </Stack>
                    )
                }
            },
            {
                header: 'reservationStatus',
                accessorKey: 'attributes.reservationStatus',
                cell: (cell) => {
                    switch (cell.getValue()) {
                        case "100":
                            return <Chip color="warning" label="Onay Bekliyor" size="small" variant="light" />;
                        case "110":
                            return <Chip color="error" label="İptal Edildi" size="small" variant="light" />;
                        case "120":
                            return <Chip color="success" label="Onaylandı" size="small" variant="light" />;
                        case "130":
                            return <Chip color="info" label="Konaklama Başladı" size="small" variant="light" />;
                        case "140":
                            return <Chip color="primary" label="Konaklama Bitti" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },

            {
                header: 'Giriş Tarihi',
                cell: ({ row }) => { return row.original.attributes.checkIn }
            },
            {
                header: 'Çıkış Tarihi',
                cell: ({ row }) => { return row.original.attributes.checkOut }
            },
            {
                header: 'Tutar',
                cell: ({ row }) => { return (row.original.attributes.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " TL") }
            }
        ], // eslint-disable-next-line
        [theme]
    );

    if (loading) return (<Loader open={loading} />)
    console.log('reservations = ', data);
    return (
        <>
            <ReactTable
                {...{
                    data,
                    columns,
                    modalToggler: () => {
                        setReservationModal(true);
                    },
                    pagination,
                    setPagination,
                    setSorting,
                    sorting,
                    globalFilter,
                    setGlobalFilter,
                    showAllReservation,
                    setShowAllReservation
                }}
            />

            <ReservationApartModal setIsAdded={setIsAdded} open={reservationModal} modalToggler={setReservationModal} villaId={params.id} />
        </>
    );
}