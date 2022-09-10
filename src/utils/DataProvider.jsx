import { useState, createContext, useContext } from "react";

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    text: "eiei",
    userData: [
      { id: "2", name: "ก", surname: "คุณากร", tel: "0891780003" },
      { id: "4", name: "ข", surname: "กัญลักษ์", tel: "0891780001" },
      { id: "1", name: "ค", surname: "ขจัดมาร", tel: "0891780002" },
    ],
  });

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
