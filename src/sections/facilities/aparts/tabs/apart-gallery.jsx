/* eslint-disable prettier/prettier */
import { Box, Button, Grid, IconButton, Stack, Tooltip } from '@mui/material';

// third-party


// project-imports
import MainCard from 'components/MainCard';
import { forwardRef, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { GetPhotosApart, PhotoPut } from 'services/photoService';
import { ReactSortable } from 'react-sortablejs';
import Loader from 'components/Loader';
import { Add, ArrangeHorizontal, CloudChange, Trash } from 'iconsax-react';
import { openSnackbar } from 'api/snackbar';
import PhotoModal from 'sections/photoSections/PhotoModal';
import PhotoModalDelete from 'sections/photoSections/PhotoModalDelete';
const CustomComponent = forwardRef < HTMLDivElement > ((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

export default function ApartGallerySection() {
  const params = useParams();

  const [photo, setPhoto] = useState();
  const [lineChangeLoading, setLineChangeLoading] = useState(true);
  const [photoList, setPhotoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoModal, setPhotoModal] = useState(false)
  const [isEdit, setIsEdit] = useState(true);
  const [photoDeleteId, setPhotoDeleteId] = useState('');
  const [photoModalDelete, setPhotoModalDelete] = useState(false);
  const [selectedPhotoDeleteItem, setSelectedPhotoDeleteItem] = useState("")


  useEffect(() => {
    if ((params.id > 0 && loading) || lineChangeLoading || isEdit)
      GetPhotosApart(params.id).then((res) => { setPhoto(res.data); setPhotoList(res.data); setLoading(false); setLineChangeLoading(false); setIsEdit(false) })
  }, [loading, lineChangeLoading, isEdit])

  const handeLineSave = () => {
    setLoading(true)

    photo.forEach((item, index) => {
      // console.log('click => ', item.id + ' - ' + index);

      const values = {
        id: item.id,
        line: index
      }

      const data = {
        ...values
      }

      PhotoPut(item.id, { data }).then((res) => {
        if ((index + 1) === photo.length) {
          setLineChangeLoading(true);
          openSnackbar({
            open: true,
            message: 'Sıralama Düzenlendi.',
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });
        }
      });

    });

  };

  const handleClose = () => {
    setPhotoModalDelete(!photoModalDelete);
  };

  if (loading) return (<Loader open={loading} />)
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <MainCard>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ paddingBottom: 4 }}>


                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button variant="contained" startIcon={<Add />} size="large" onClick={() => { setPhotoModal(true) }}>
                    Resim Ekle
                  </Button>
                  {
                    photo?.length > 0 &&
                    <Button variant="contained" color='warning' startIcon={<ArrangeHorizontal />} onClick={handeLineSave} size="large">
                      SIRALAMAYI KAYDET
                    </Button>
                  }
                </Stack>
              </Stack>
              <Grid container spacing={1.25}>
                {!loading && (
                  <ReactSortable tag={CustomComponent} list={photo} setList={setPhoto}>
                    {photo.map((item, index) => (
                      <div style={{ width: '160px', height: '170px', float: 'left', margin: '10px' }} key={item.attributes.line} data-index={index}>
                        <img src={item.attributes.photo.data.attributes.url} width={160} height={140} style={{ border: '3px solid #999696' }} />
                        <Stack direction="row" spacing={0}>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                                setPhotoDeleteId(Number(item.id));
                                setSelectedPhotoDeleteItem(item?.attributes?.photo?.data?.attributes?.url)
                                // console.log("photoId => ", Number(item.id));
                              }}
                            >
                              <Trash />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        {/* <span style={{ float: 'left', lineHeight: '16px' }}>[id: {item.id}] - </span>
                        <span style={{ float: 'left', lineHeight: '16px' }}>[index: {index}] - </span>
                        <span style={{ float: 'left', lineHeight: '16px' }}>[line: {item.attributes.line}]</span> */}

                      </div>
                    ))}
                  </ReactSortable>
                )}

              </Grid>
              <PhotoModalDelete selectedItem={selectedPhotoDeleteItem} setIsEdit={setIsEdit} id={Number(photoDeleteId)} title={photoDeleteId} open={photoModalDelete} handleClose={handleClose} />

              <PhotoModal apart={true} open={photoModal} modalToggler={setPhotoModal} villaId={params.id} setIsEdit={setIsEdit} lastLine={photo[photoList.length - 1]?.attributes.line} setLoading={setLoading} />

            </MainCard>
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
}
