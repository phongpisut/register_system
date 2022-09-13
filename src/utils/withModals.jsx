import { useState, useCallback, Suspense } from "react";
import { Modal } from "rsuite";
import CheckOutlineIcon from "@rsuite/icons/CheckOutline";
import CloseOutlineIcon from "@rsuite/icons/CloseOutline";

const withModals =
  (Component) =>
  ({ ...props }) => {
    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState({
      title: "",
      detail: "",
      status: true,
    });

    const handleClose = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const openModal = useCallback(
      (title, detail, status) => {
        setModalData({ title, detail, status });
        setOpen(true);
      },
      [setOpen, setModalData]
    );

    return (
      <>
        <Modal size="xs" open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title className="font-IBM py-1">
              {modalData.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="justify-center flex  flex-col items-center">
              {modalData.status ? (
                <CheckOutlineIcon color="green" width={60} height={60} />
              ) : (
                <CloseOutlineIcon color="red" width={60} height={60} />
              )}
              <p className="mt-1 font-IBM">{modalData.detail}</p>
            </div>
          </Modal.Body>
        </Modal>

        <Component {...props} openModal={openModal} />
      </>
    );
  };

export default withModals;
