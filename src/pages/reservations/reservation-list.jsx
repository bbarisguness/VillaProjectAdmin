/* eslint-disable prettier/prettier */
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Typography, Box, FormControlLabel, Switch, Tooltip, IconButton, } from '@mui/material';

// third-party
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import { DebouncedInput, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Eye, Trash } from 'iconsax-react';

// custom
import { ReservationServices } from 'services';
import Loader from 'components/Loader';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ReservationModal from 'sections/reservations/ReservationModal';
import ReservationModalDelete from 'sections/reservations/ReservationModalDelete';
import { stringToDate } from 'utils/custom/dateHelpers';

const fallbackData = [];
function ReactTable({ data, columns, modalToggler, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, showAllReservation, setShowAllReservation, showAgencyReservation, setShowAgencyReservation }) {

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
                    placeholder={`Müşteri adı`}
                />

                <Stack direction="row" alignItems="center" spacing={2}>
                    <FormControlLabel style={{ position: 'relative', top: '5px' }} control={<Switch sx={{ mt: 0 }} />} label={<p style={{ position: 'relative', top: '-4px' }}>Ev Sahibi Rezervasyonları</p>} labelPlacement="start" checked={showAllReservation} onChange={() => setShowAllReservation(!showAllReservation)} />
                    <FormControlLabel style={{ position: 'relative', top: '5px' }} control={<Switch sx={{ mt: 0 }} />} label={<p style={{ position: 'relative', top: '-4px' }}>Acenta Rezervasyonları</p>} labelPlacement="start" checked={showAgencyReservation} onChange={() => setShowAgencyReservation(!showAgencyReservation)} />
                    {/* <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
                        Rezervasyon Ekle
                    </Button> */}
                </Stack>
            </Stack>
            <ScrollX>
                <Stack>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        <TableCell
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box>SIRA</Box>
                                            </Stack>
                                        </TableCell>
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
                                {table.getRowModel().rows.map((row, i) => (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => {
                                            // console.log("Kayıt Id => ", row.original.id);
                                            navigate(`/reservations/show/summary/${row.original.id}`)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            {(pagination.pageIndex * pagination.pageSize) + (i + 1)}
                                        </TableCell>
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

export default function ReservationList() {
    const theme = useTheme();
    const params = useParams();

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [reservationModal, setReservationModal] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false)
    const [showAllReservation, setShowAllReservation] = useState(false)
    const [reservationDeleteId, setReservationDeleteId] = useState('');
    const [reservationModalDelete, setReservationModalDelete] = useState(false);
    const [selectedReservationDeleteItem, setSelectedReservationDeleteItem] = useState([])

    const [showAgencyReservation, setShowAgencyReservation] = useState(true)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        ReservationServices.GetAllReservations(pagination.pageIndex, pagination.pageSize, showAllReservation, showAgencyReservation, globalFilter).then((res) => { setData(res); setLoading(false); });
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, showAllReservation, showAgencyReservation]);


    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter, showAllReservation])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setLoading(true)
            //ReservationServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
            ReservationServices.GetAllReservations(pagination.pageIndex, pagination.pageSize, showAllReservation, showAgencyReservation, globalFilter).then((res) => { setData(res); setLoading(false); });
        }
    }, [isDeleted])

    const columns = useMemo(
        () => [
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
                                <Typography variant="subtitle1">{`${row?.original?.reservationInfos[0]?.name ? row?.original?.reservationInfos[0]?.name : 'Ev Sahibi'} ${row?.original?.reservationInfos[0]?.surname ? row?.original?.reservationInfos[0]?.surname : ''}`}</Typography>
                            </Stack>
                        </Stack>
                    )
                }
            },
            {
                header: 'Tesis Adı',
                cell: ({ row }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            alt="Avatar"
                            size="sm"
                            src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
                        />
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row?.original?.villa !== null ? row?.original?.villa?.villaDetails[0]?.name : row?.original?.room?.roomDetails[0]?.name}</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'reservationStatus',
                accessorKey: 'reservationStatusType',
                cell: (cell) => {
                    switch (cell.getValue()) {
                        case 1:
                            return <Chip color="success" label="Rezerve" size="small" variant="light" />;
                        case 2:
                            return <Chip color="info" label="Opsiyonlanmış" size="small" variant="light" />;
                        case 3:
                            return <Chip color="error" label="İptal Edilmiş" size="small" variant="light" />;
                        case 4:
                            return <Chip color="primary" label="Konaklama Bitmiş" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },

            {
                header: 'Giriş Tarihi',
                cell: ({ row }) => { return stringToDate(row.original.checkIn) }
            },
            {
                header: 'Çıkış Tarihi',
                cell: ({ row }) => { return stringToDate(row.original.checkOut) }
            },
            {
                header: 'Tutar',
                cell: ({ row }) => { return (row.original.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " TL") }
            },
            {
                header: 'Actions',
                meta: {
                    className: 'cell-center'
                },
                disableSortBy: true,
                cell: ({ row }) => {
                    const collapseIcon =
                        row.getCanExpand() && row.getIsExpanded() ? (
                            <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
                        ) : (
                            <Eye />
                        );
                    return (
                        <Stack direction="row" spacing={0}>
                            <Tooltip title="View">
                                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                        setReservationDeleteId(Number(row.original.id));
                                        setSelectedReservationDeleteItem(row.original.attributes);
                                    }}
                                >
                                    <Trash />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                }
            }
        ], // eslint-disable-next-line
        [theme]
    );


    const handleClose = () => {
        setReservationModalDelete(!reservationModalDelete);
    };

    if (loading) return (<Loader open={loading} />)

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
                    setShowAllReservation,
                    setShowAgencyReservation,
                    showAgencyReservation
                }}
            />

            <ReservationModal open={reservationModal} modalToggler={setReservationModal} villaId={params.id} />
            <ReservationModalDelete selectedItem={selectedReservationDeleteItem} setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(reservationDeleteId)} title={reservationDeleteId} open={reservationModalDelete} handleClose={handleClose} />
        </>
    );
}