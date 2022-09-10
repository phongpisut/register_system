import { useState, useCallback } from "react";

import { Form, Button, Input, Modal, InputGroup } from "rsuite";
import { model } from "./FormSchema";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";

export default function RegisterForm() {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    name: "",
    surname: "",
    contact: "",
  });

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onChangeForm = useCallback(
    (e) => {
      if (formValue.contact === e?.contact) {
        setFormValue(e);
      } else {
        if (/^[0-9]*$/.test(e?.contact) && e?.contact.length <= 10)
          setFormValue(e);
      }
    },
    [formValue]
  );

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
            </Form.Group>

            <Form.Group controlId="contact-1">
              <Form.ControlLabel>เบอร์ติดต่อ</Form.ControlLabel>
              <InputGroup>
                <InputGroup.Addon>
                  <AvatarIcon />
                </InputGroup.Addon>
                <Form.Control name="contact" type="tel" />
              </InputGroup>
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle" color="blue" active>
            ตกลง
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={handleOpen}>New User</Button>
    </>
  );
}
