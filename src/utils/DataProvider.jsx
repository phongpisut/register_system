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

  const login = useCallback(
    (username = "", password = "") =>
      new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.set(
          "Authorization",
          "Basic " + window.btoa(username + ":" + password)
        );
        fetch("http://localhost:6220/getSetting", {
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

  const updateMaximum = useCallback(
    (maximum) =>
      new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.set(
          "Authorization",
          "Basic " + window.btoa(auth.username + ":" + auth.password)
        );
        headers.set("Content-Type", "application/json");

        fetch(`http://localhost:6220/editSetting/${auth.id}`, {
          headers: headers,

          method: "PUT",
          body: JSON.stringify({ maximum: Number(maximum) }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === 200) {
              const { maximum } = result?.data?.data;
              if (data?.userData.length > 0) {
                if (maximum >= 0) {
                  let newUserData = data?.userData.slice(0, maximum);
                  setData({
                    userData: newUserData,
                    count: newUserData.length,
                    remaining: maximum - newUserData.length,
                    max: maximum,
                  });
                }
              }
              resolve(result);
            } else {
              reject();
            }
          })
          .catch((e) => reject(e));
      }),
    [auth]
  );

  const getUserData = useCallback(() => {
    fetch("http://localhost:6220/userList", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        const { settings, users } = result?.data;
        const { maximum } = settings;
        if (users?.length > 0) {
          let newUserData = users.slice(0, maximum);
          let safeMaximum = maximum || 10;
          setData({
            userData: newUserData,
            count: newUserData.length,
            remaining: safeMaximum - newUserData.length,
            max: safeMaximum,
          });
        }
      })
      .catch((e) => e);
  }, [setData]);

  const addData = useCallback(
    (formData) =>
      new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.set("Content-Type", "application/json");

        fetch(`http://localhost:6220/addUser`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify(formData),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <DataContext.Provider
      value={{ ...data, isAdmin, login, updateMaximum, addData }}
    >
      {children}
    </DataContext.Provider>
  );
};
