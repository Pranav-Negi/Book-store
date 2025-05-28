import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userid, setuserid] = useState(() => localStorage.getItem("userid"));

  useEffect(() => {
    if (userid) localStorage.setItem("userid", userid);
    else localStorage.removeItem("userid", userid);
  }, [userid]);

  return (
    <UserContext.Provider value={{ userid, setuserid}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = ()=>useContext(UserContext)