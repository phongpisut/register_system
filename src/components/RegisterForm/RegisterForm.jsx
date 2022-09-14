import { useState, useCallback, useEffect } from "react";

import {
  Form,
  Button,
  Modal,
  InputGroup,
  IconButton,
  Tooltip,
  Whisper,
} from "rsuite";
import { model } from "./FormSchema";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";

import { withModals } from "~/utils";

function RegisterForm({ remaining, openModal, addData, openSeat }) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [formValue, setFormValue] = useState({
    name: "",
    surname: "",
    tel: "",
  });

  useEffect(() => {
    if (
      Object.keys(formError).length === 0 &&
      formValue.name !== "" &&
      formValue.surname !== "" &&
      formValue.tel !== ""
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formValue, formError]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onChangeForm = useCallback(
    (e) => {
      if (formValue.tel === e?.tel) {
        setFormValue(e);
      } else {
        if (/^[0-9]*$/.test(e?.tel) && e?.tel.length <= 10) setFormValue(e);
      }
    },
    [formValue]
  );

  const onSubmit = useCallback(() => {
    addData({ ...formValue, seat: openSeat[0] })
      .then(() => {
        handleClose();
        openModal("สำเร็จ", "เพิ่มข้อมูลสำเร็จ", true);
      })
      .catch((e) => openModal("เกิดข้อผิดพลาด", "เพิ่มข้อมูลไม่สำเร็จ", false));
  }, [formValue]);

  return (
    <>
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title className="font-IBM">ลงทะเบียนเข้าร่วมงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onChangeForm}
            formValue={formValue}
            onCheck={setFormError}
            model={model}
            className="font-IBM"
          >
            <Form.Group controlId="name-1">
              <Form.ControlLabel>ชื่อ</Form.ControlLabel>
              <Form.Control name="name" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="surname-1">
              <Form.ControlLabel>นามสกุล</Form.ControlLabel>
              <Form.Control name="surname" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>

            <Form.Group controlId="tel-1">
              <Form.ControlLabel>เบอร์ติดต่อ</Form.ControlLabel>
              <InputGroup>
                <InputGroup.Addon>
                  <AvatarIcon />
                </InputGroup.Addon>
                <Form.Control name="tel" type="tel" />
              </InputGroup>
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={onSubmit}
            appearance="subtle"
            color="blue"
            active
            disabled={disabled}
          >
            ตกลง
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
      <Whisper
        disabled={remaining > 0}
        placement="right"
        controlId="control-id-active"
        trigger="active"
        speaker={<Tooltip className="font-IBM">ที่นั่งเต็มแล้ว</Tooltip>}
      >
        <IconButton
          aria-label="config button"
          className={`ml-2 ${remaining > 0 ? "opacity-100" : "opacity-50"}`}
          icon={<PlusRoundIcon />}
          size="md"
          color={"green"}
          active
          appearance="primary"
          circle
          onClick={() => remaining > 0 && handleOpen()}
        />
      </Whisper>
    </>
  );
}

export default withModals(RegisterForm);
