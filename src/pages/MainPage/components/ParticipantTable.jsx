import { useCallback, useState, useEffect } from "react";
import { Table, Input, InputGroup, Modal, Button } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { withModals } from "~/utils";

const { Column, HeaderCell, Cell } = Table;

function ParticipantTable({
  userData,
  isAdmin,
  max,
  acquiredSeat,
  editSeat,
  openConfirm,
  isConfirm,
}) {
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState(userData);
  const [searchText, setSearchText] = useState("");
  const [openEditSeat, setOpenEditSeat] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(0);
  const [oldSeat, setOldSeat] = useState(0);
  const [selectedUser, setSelectedUser] = useState({});
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const getType = useCallback((x) => {
    if (!isNaN(x)) {
      return Number(x);
    } else if (typeof x === "string") {
      return x.charCodeAt();
    } else return x;
  }, []);

  useEffect(() => {
    setLoading(true);
    setFilterData(userData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [userData]);

  useEffect(() => {
    if (userData.find((x) => x.seat > max)) {
      alert("มีจำนวนผู้ลงทะเบียนที่นั่งเกินจำนวน!");
    }
  }, [userData, max]);

  useEffect(() => {
    searchText !== ""
      ? setFilterData(
          userData.filter(
            (x) =>
              x.tel?.includes(searchText) ||
              x.name?.includes(searchText) ||
              x.surname?.includes(searchText)
          )
        )
      : setFilterData(userData);
  }, [searchText]);

  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getData = useCallback(
    (_sortColumn, _sortType) => {
      if (_sortColumn && _sortType) {
        return filterData.sort((a, b) => {
          let x = a[_sortColumn];
          let y = b[_sortColumn];

          x = getType(x);
          y = getType(y);

          if (_sortType === "asc") {
            return x - y;
          } else {
            return y - x;
          }
        });
      }
      return userData;
    },
    [filterData]
  );

  const handleSortColumn = useCallback(
    (_sortColumn, _sortType) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSortColumn(_sortColumn);
        setSortType(_sortType);
        setFilterData(getData(_sortColumn, _sortType));
      }, 500);
    },
    [sortColumn, sortType, filterData, getData]
  );

  const onEditSeat = useCallback(
    (e) => {
      setSelectedUser(filterData.find((x) => x.seat == e));
      setOldSeat(Number(e));
      setCurrentSeat(Number(e));
      setOpenEditSeat(true);
    },
    [filterData]
  );

  const onSelectSeat = useCallback(
    (i) => {
      setCurrentSeat(i + 1);
    },
    [currentSeat]
  );

  const onSubmit = useCallback(() => {
    if (oldSeat !== currentSeat) {
      openConfirm("กรุณายืนยัน", "ท่านยืนยันที่จะเปลี่ยนที่นั่งหรือไม่?");
    }
  }, [oldSeat, currentSeat, selectedUser, openConfirm]);

  useEffect(() => {
    if (isConfirm) {
      editSeat({ ...selectedUser, seat: currentSeat }).then(() =>
        setOpenEditSeat(false)
      );
    }
  }, [isConfirm]);

  const getSeatColor = useCallback(
    (i) => {
      if (i + 1 == currentSeat) {
        return "green";
      }
      return "blue";
    },
    [currentSeat]
  );

  const getDisable = useCallback(
    (i) => {
      if (acquiredSeat.includes(i + 1) && i + 1 == currentSeat) {
        return false;
      } else if (acquiredSeat.includes(i + 1) && i + 1 !== oldSeat) {
        return true;
      }
    },
    [currentSeat, acquiredSeat, oldSeat]
  );

  return (
    <>
      <Modal
        open={openEditSeat}
        onClose={() => setOpenEditSeat(false)}
        size="xs"
      >
        <Modal.Header>
          <Modal.Title className="font-IBM">เลือกที่นั่ง</Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid grid-cols-5 grid-flow-row justify-items-center gap-2 px-2">
          {max > 0 &&
            [...Array(max)].map((x, i) => (
              <Button
                key={`seat-${i}`}
                appearance="primary"
                onClick={() => onSelectSeat(i)}
                color={getSeatColor(i)}
                disabled={getDisable(i)}
                active
                className={`w-11`}
                size="md"
              >
                <p>{i + 1}</p>
              </Button>
            ))}
        </Modal.Body>
        <Modal.Footer className="py-2">
          <Button appearance="subtle" color="blue" active onClick={onSubmit}>
            ตกลง
          </Button>
          <Button onClick={() => setOpenEditSeat(false)} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
      <InputGroup>
        <Input onChange={(e) => setSearchText(e)} aria-label="search box" />
        <InputGroup.Addon>
          <SearchIcon />
        </InputGroup.Addon>
      </InputGroup>

      <Table
        style={{
          overflow: "scroll",
          maxHeight: windowHeight / 2.2,
        }}
        wordWrap="break-word"
        data={filterData}
        sortColumn={sortColumn}
        sortType={sortType}
        rowHeight={60}
        autoHeight
        onSortColumn={handleSortColumn}
        className="font-IBM text-base"
        loading={loading}
      >
        <Column width={65} sortable fixed align="center">
          <HeaderCell>ที่นั่ง</HeaderCell>
          <Cell
            dataKey="seat"
            renderCell={(e) => {
              return isAdmin ? (
                <Button
                  onClick={() => onEditSeat(e)}
                  appearance="subtle"
                  color={`${Number(e) > max ? "red" : "cyan"}`}
                  active
                >
                  <p>{e}</p>
                </Button>
              ) : (
                <p
                  className={`${
                    Number(e) > max ? "text-rose-500" : ""
                  } text-current`}
                >
                  {e}
                </p>
              );
            }}
          />
        </Column>

        <Column flexGrow={1} sortable align="center">
          <HeaderCell>ชื่อ</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} sortable align="center">
          <HeaderCell>นามสกุล</HeaderCell>
          <Cell dataKey="surname" />
        </Column>

        <Column flexGrow={1} sortable align="center">
          <HeaderCell>เบอร์โทร</HeaderCell>
          <Cell
            dataKey="tel"
            renderCell={(e) => {
              return isAdmin ? e : e?.replace(e.substring(2, 8), "XXXXXX");
            }}
          />
        </Column>
      </Table>
    </>
  );
}

export default withModals(ParticipantTable);
