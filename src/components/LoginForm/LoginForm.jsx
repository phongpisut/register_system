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
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { withModals } from "~/utils";

import GearIcon from "@rsuite/icons/Gear";

function RegisterForm({ onSubmit, isAdmin, openModal }) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState({});
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [isLoginFail, setLoginFail] = useState(false);

  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (
      Object.keys(formError).length === 0 &&
      formValue.username !== "" &&
      formValue.password !== ""
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formValue, formError]);

  const handleClose = useCallback(() => {
    setFormValue({
      username: "",
      password: "",
    });
    setFormError({});
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onPressSubmit = useCallback(() => {
    onSubmit(formValue.username, formValue.password)
      .then(() => {
        handleClose();
        openModal("สำเร็จ", "เข้าสู่ระบบสำเร็จ", true);
      })
      .catch(() => setLoginFail(true));
  }, [formValue]);

  return (
    <>
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title className="font-IBM pb-1">
            เข้าสู่ระบบการจัดการ
          </Modal.Title>
          {isLoginFail && (
            <p className="font-IBM text-rose-500">เข้าสู่ระบบไม่สำเร็จ</p>
          )}
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={setFormValue}
            formValue={formValue}
            onFocus={() => setLoginFail(false)}
            onCheck={setFormError}
            model={model}
            className="font-IBM"
          >
            <Form.Group controlId="username-1">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control
                name="username"
                className={isLoginFail ? "border-rose-500" : ""}
              />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="password-1">
              <Form.ControlLabel>Password</Form.ControlLabel>
              <InputGroup
                inside
                className={isLoginFail ? "border-rose-500" : ""}
              >
                <Form.Control
                  name="password"
                  type={visible ? "text" : "password"}
                />
                <InputGroup.Button onClick={() => setVisible((prev) => !prev)}>
                  {visible ? <EyeIcon /> : <EyeSlashIcon />}
                </InputGroup.Button>
              </InputGroup>

              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={onPressSubmit}
            appearance="subtle"
            type="submit"
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
        disabled={!isAdmin}
        placement="left"
        controlId="control-id-active"
        trigger="active"
        className="mr-4"
        speaker={<Tooltip className="font-IBM">เข้าสู่ระบบแล้ว</Tooltip>}
      >
        <IconButton
          aria-label="register button"
          size="lg"
          icon={<GearIcon color="white" />}
          onClick={() => !isAdmin && handleOpen()}
        />
      </Whisper>
    </>
  );
}

export default withModals(RegisterForm);
