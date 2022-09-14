import { useState, useCallback } from "react";
import { Modal, Button } from "rsuite";
import CheckOutlineIcon from "@rsuite/icons/CheckOutline";
import CloseOutlineIcon from "@rsuite/icons/CloseOutline";

const withModals =
  (Component) =>
  ({ ...props }) => {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [modalData, setModalData] = useState({
      title: "",
      detail: "",
      status: true,
    });
    const [confirmData, setConfirmData] = useState({
      title: "",
      detail: "",
    });
    const [isConfirm, setIsConfirm] = useState(false);

    const handleClose = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const openModal = useCallback(
      (title, detail, status) => {
        setModalData({ title, detail, status });
        setOpen(true);
      },
      [setOpen, setModalData, isConfirm]
    );

    const onOpenConfirm = useCallback(
      (title = "", detail = "") => {
        setConfirmData({ title, detail });
        setOpenConfirm(true);
      },
      [setConfirmData]
    );

    const handleCloseConfirm = useCallback(() => {
      setOpenConfirm(false);
      setIsConfirm(false);
    }, [setOpenConfirm, setIsConfirm]);

    const handleConfirm = useCallback(() => {
      setIsConfirm(true);
      setOpenConfirm(false);
    }, [setIsConfirm, setOpenConfirm]);

    return (
      <>
        <Modal open={openConfirm} onClose={handleCloseConfirm} size="xs">
          <Modal.Header>
            <Modal.Title className="font-IBM">{confirmData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{confirmData.detail}</Modal.Body>
          <Modal.Footer className="py-2">
            <Button
              appearance="subtle"
              color="blue"
              active
              onClick={handleConfirm}
            >
              ตกลง
            </Button>
            <Button onClick={handleCloseConfirm} appearance="subtle">
              ยกเลิก
            </Button>
          </Modal.Footer>
        </Modal>

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

        <Component
          {...props}
          openModal={openModal}
          openConfirm={onOpenConfirm}
          isConfirm={isConfirm}
        />
      </>
    );
  };

export default withModals;
