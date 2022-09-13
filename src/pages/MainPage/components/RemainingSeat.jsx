import { useCallback, useState, useEffect, useMemo } from "react";
import { Progress, Badge, InputNumber, Button, Modal } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";

export default function RemainingSeat({
  count,
  max,
  remaining,
  isAdmin,
  onChangeMax,
}) {
  const [open, setOpen] = useState(false);
  const [newMax, setNewMax] = useState(max);

  useEffect(() => setNewMax(max), [max]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onSubmit = useCallback(() => {
    onChangeMax(newMax);
    handleClose();
  }, [newMax]);

  const getStatusBarColor = useMemo(() => {
    const percent = (count * 100) / max;
    if (percent >= 100) {
      return "#f44336";
    } else if (percent >= 50) {
      return "#ffb300";
    } else {
      return "#2196f3";
    }
  }, [count, max]);

  return (
    <>
      <Modal size="xs" open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="font-IBM py-1">แก้ไขจำนวนที่นั่ง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputNumber min={1} value={newMax} onChange={(e) => setNewMax(e)} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onSubmit} appearance="primary" active>
            ยืนยัน
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
      <div className=" justify-items-end flex flex-col place-items-end">
        <div
          className="drop-shadow-md rounded bg-gradient-to-r from-blue-600 to-blue-500 mr-1 justify-center flex flex-row content-center items-center"
          style={{ minWidth: 130 }}
        >
          <p className="text-white text-base font-IBM py-1 px-2 text-center ">
            {count || "-"} / {!isAdmin && `${max} ที่นั่ง`}
          </p>
          {isAdmin && (
            <div className="py-1 flex flex-row items-center">
              <Button
                className="text-white text-base font-IBM"
                active
                size="xs"
                onClick={() => setOpen(true)}
              >
                {max}
                <EditIcon className="ml-1" />
              </Button>
              <p className="text-white text-base font-IBM mx-2">ที่นั่ง</p>
            </div>
          )}
        </div>
        <div className="flex-row flex justify-items-center pr-1 mt-1 w-36">
          <Progress.Line
            percent={(count * 100) / max}
            showInfo={false}
            strokeColor={getStatusBarColor}
            className="my-0 py-1 drop-shadow-md"
          />
          <Badge
            color={`${remaining > 0 ? "blue" : "red"}`}
            content={`${remaining > 0 ? remaining : "เต็ม"}`}
            className=" text-clip text-ellipsis drop-shadow-md text-slate-50 font-IBM"
          />
        </div>
      </div>
    </>
  );
}
