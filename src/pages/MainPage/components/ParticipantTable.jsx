import { useCallback, useState, useEffect } from "react";
import { Table, Input, InputGroup } from "rsuite";
import { useDataContext } from "~/utils";
import SearchIcon from "@rsuite/icons/Search";

const { Column, HeaderCell, Cell } = Table;

export default function ParticipantTable({ userData, isAdmin }) {
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState(userData);
  const [searchText, setSearchText] = useState("");

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

  return (
    <>
      <InputGroup>
        <Input onChange={(e) => setSearchText(e)} />
        <InputGroup.Addon>
          <SearchIcon />
        </InputGroup.Addon>
      </InputGroup>

      <Table
        style={{ maxHeight: 350, overflow: "scroll" }}
        wordWrap="break-word"
        data={filterData}
        sortColumn={sortColumn}
        sortType={sortType}
        rowHeight={60}
        autoHeight
        onSortColumn={handleSortColumn}
        loading={loading}
      >
        <Column flexGrow={1} sortable align="center">
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} sortable align="center">
          <HeaderCell>Surname</HeaderCell>
          <Cell dataKey="surname" />
        </Column>

        <Column flexGrow={1} sortable align="center">
          <HeaderCell>Tel</HeaderCell>
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
