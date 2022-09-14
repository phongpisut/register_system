import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    userData: [],
    remaining: 10,
    max: 10,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [auth, setAuth] = useState({ username: "", password: "", id: "" });
  const [acquiredSeat, setAcquiredSeat] = useState([]);
  const [openSeat, setOpenSeat] = useState([]);

  const login = useCallback(
    (username = "", password = "") =>
      new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.set(
          "Authorization",
          "Basic " + window.btoa(username + ":" + password)
        );
        fetch("http://192.168.1.55:6220/getSetting", {
          headers: headers,
          method: "GET",
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === 200) {
              const { data } = result?.data;
              setAuth({
                username: username,
                password: password,
                id: data[0]?.id || "",
              });
              setIsAdmin(true);
              resolve(result);
            } else {
              reject();
            }
          })
          .catch((e) => reject(e));
      }),
    [setAuth]
  );

  const getUserData = useCallback(() => {
    fetch("http://192.168.1.55:6220/userList", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        const { settings, users } = result?.data;
        const { maximum } = settings;
        if (users?.length > 0) {
          let newUserData = users.slice(0, maximum);
          let safeMaximum = maximum || 10;
          const acquire = users.map((x) => x.seat);
          const open = [...Array(maximum)]
            .map((_, i) => i + 1)
            .filter((x) => !acquire.includes(x));

          setAcquiredSeat(acquire);
          setOpenSeat(open);

          setData({
            userData: newUserData,
            count: newUserData.length,
            remaining: safeMaximum - newUserData.length,
            max: safeMaximum,
          });
        }
      })
      .catch((e) => e);
  }, [setData, setAcquiredSeat, setOpenSeat]);

  const updateMaximum = useCallback(
    (maximum) =>
      new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.set(
          "Authorization",
          "Basic " + window.btoa(auth.username + ":" + auth.password)
        );
        headers.set("Content-Type", "application/json");

        fetch(`http://192.168.1.55:6220/editSetting/${auth.id}`, {
          headers: headers,

          method: "PUT",
          body: JSON.stringify({ maximum: Number(maximum) }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === 200) {
              getUserData();
              resolve(result);
            } else {
              reject();
            }
          })
          .catch((e) => reject(e));
      }),
    [auth, getUserData]
  );

  const addData = useCallback(
    (formData) =>
      new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.set("Content-Type", "application/json");

        fetch(`http://192.168.1.55:6220/addUser`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify(formData),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === 201) {
              getUserData();
              resolve();
            } else {
              reject();
            }
          })
          .catch((e) => reject(e));
      }),
    [getUserData]
  );

  const editSeat = useCallback(
    (user) =>
      new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.set(
          "Authorization",
          "Basic " + window.btoa(auth.username + ":" + auth.password)
        );
        headers.set("Content-Type", "application/json");

        fetch(`http://192.168.1.55:6220/editUser/${user.id}`, {
          headers: headers,
          method: "PUT",
          body: JSON.stringify(user),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === 200) {
              getUserData();
              resolve();
            } else {
              reject();
            }
          })
          .catch((e) => reject(e));
      }),
    [auth, getUserData]
  );

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        ...data,
        isAdmin,
        login,
        updateMaximum,
        addData,
        acquiredSeat,
        openSeat,
        editSeat,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
