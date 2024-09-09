/* eslint-disable prettier/prettier */
import { useMediaQuery, Grid, Stack, List, Divider, ListItem, ListItemIcon, Typography, ListItemSecondaryAction, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton, Button } from '@mui/material';
import { useLocation, Link, Outlet, useParams, useNavigate } from 'react-router-dom';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import { Add, CallCalling, Eye, Gps, Pointer, Sms, Trash, Wifi } from 'iconsax-react';
import { GetApart,  ApartChangeState } from 'services/apartServices';
import {GetRoomList } from 'services/roomServices';
import { useState, useEffect } from 'react';

import { openSnackbar } from 'api/snackbar';
import Loader from 'components/Loader';
import RoomAddModal from '../RoomAddModal';

export default function ApartSummarySection() {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const params = useParams();
  const [villa, setVilla] = useState();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([])
  const [roomAddModal, setRoomAddModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    if (params.id > 0 && loading) {
      GetApart(params.id).then((res) => {
        setVilla(res.data);
        GetRoomList(params.id).then((res) => {
          setRooms(res.data)
          setLoading(false)
        })
      })
    }

  }, [loading])

  useEffect(() => {
    if (isEdit) {
      setIsEdit(false)
      GetApart(params.id).then((res) => {
        setVilla(res.data);
        GetRoomList(params.id).then((res) => {
          setRooms(res.data)
          setLoading(false)
        })
      })
    }
  }, [isEdit])


  function changeStateHandle() {

    if (villa?.attributes?.publishedAt === null) {
      const nowDate = new Date()
      const data = {
        publishedAt: nowDate
      }
      ApartChangeState(params.id, { data }).then((res) => {
        setLoading(true)
        if (!res?.error) {

          openSnackbar({
            open: true,
            message: 'Apart Yayınlandı.',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });
        }
        else {
          openSnackbar({
            open: true,
            message: res?.error?.message,
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          });

        }
      })

    } else {
      const data = {
        publishedAt: null
      }
      ApartChangeState(params.id, { data }).then((res) => {
        setLoading(true)
        if (!res?.error) {



          openSnackbar({
            open: true,
            message: 'Apart Yayından Kaldırıldı.',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'warning'
            }
          });
        }
        else {
          openSnackbar({
            open: true,
            message: res?.error?.message,
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          });
        }
      })
    }
  }


  if (loading) return (<Loader open={loading} />)
  return (
    <>
      <RoomAddModal open={roomAddModal} modalToggler={setRoomAddModal} villaId={params.id} setIsEdit={setIsEdit} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4} xl={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {villa && (
                <MainCard>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="flex-end">
                        <div onClick={() => changeStateHandle()}>
                          <Chip style={{ cursor: 'pointer' }} label={villa?.attributes?.publishedAt === null ? 'Pasif' : 'Aktif'} size="small" color={villa?.attributes?.publishedAt === null ? 'error' : 'success'} />
                        </div>
                      </Stack>
                      <Stack spacing={2.5} alignItems="center">
                        <Avatar alt={villa.attributes.name} size="xxl" src={villa?.attributes?.photos?.data[0]?.attributes?.photo?.data?.attributes?.url} />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.attributes.name}</Typography>
                          <Typography color="secondary">{villa.attributes.region}</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-around" alignItems="center">
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.attributes.room}</Typography>
                          <Typography color="secondary">Oda</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.attributes.bath}</Typography>
                          <Typography color="secondary">Banyo</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{villa.attributes.person}</Typography>
                          <Typography color="secondary">Kapasite</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                        <ListItem>
                          <ListItemIcon>
                            <Sms size={18} />
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">Apart Sahibi Adı Soyadı</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CallCalling size={18} />
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">0532 000 00 00</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Gps size={18} />
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">Fethiye</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Wifi size={18} />
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa.attributes.wifiPassword || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <span>Su No</span>
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa.attributes.waterMaterNumber || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <span>Elektrik No</span>
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa.attributes.electricityMeterNumber || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <span>İnternet No</span>
                          </ListItemIcon>
                          <ListItemSecondaryAction>
                            <Typography align="right">{villa.attributes.internetMeterNumber || '-'}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </MainCard>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={7} md={8} xl={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainCard title="Apartdaki Odalar">
                <Button style={{ float: 'right', marginBottom: 16 }} onClick={() => setRoomAddModal(true)} size='small' type="button" variant="contained">Oda Ekle</Button>
                <TableContainer>
                  <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Oda Adı</TableCell>
                        <TableCell align="left">Kapasite</TableCell>
                        <TableCell align="left">Oda Sayısı</TableCell>
                        <TableCell align="left">Banyo Sayısı</TableCell>
                        <TableCell align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        rooms?.map((row, i) => {
                          return (
                            <TableRow hover key={row.id} sx={{cursor:'Pointer'}} onClick={() => { navigate(`/facilities/aparts/room-show/summary/${row.id}`) }}>
                              <TableCell sx={{ pl: 3 }} component="th" scope="row">
                                {row.attributes.name}
                              </TableCell>
                              <TableCell align="left">{row.attributes.person}</TableCell>
                              <TableCell align="left">{row.attributes.room}</TableCell>
                              <TableCell align="left">{row.attributes.bath}</TableCell>
                              <TableCell align="left">
                                <Tooltip title="View">
                                  <IconButton color="secondary" >
                                    {<Eye />}
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
