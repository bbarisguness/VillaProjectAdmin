/* eslint-disable prettier/prettier */

// material-ui
import Modal from '@mui/material/Modal';

// project imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

import ReservationCustomerAddForm from './reservation-customers-add-form';


export default function ReservationCustomerModal({ open, modalToggler,  setIsEdit }) {

    const closeModal = () => modalToggler(false);

    return (
        <>
            {open && (
                <Modal
                    open={open}
                    onClose={closeModal}
                    aria-labelledby="modal-customer-add-label"
                    aria-describedby="modal-customer-add-description"
                    sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
                >
                    <MainCard
                        sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
                        modal
                        content={false}
                    >
                        <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
                            <ReservationCustomerAddForm closeModal={closeModal} setIsEdit={setIsEdit}  />
                        </SimpleBar>
                    </MainCard>
                </Modal>
            )}
        </>
    );
}


