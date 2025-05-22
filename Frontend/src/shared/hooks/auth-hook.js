import { useState, useCallback, useEffect } from 'react'; 

export const useAuth = () => {
  const [token, setToken] = useState(null); 
  const [userId, setUserId] = useState(null); // set the default value of userId as null
  const [expireTime, setExpireTime] = useState(null);  
  const currentTime = new Date().getTime(); 
  const login = useCallback((uid, token, expirationDate) => { 
    setToken(token); 
    setUserId(uid); // set the userId to u1
    const tockenExpirationDate = expirationDate || new Date(currentTime +  6048*10**5).toISOString(); 
    // set the expiration date to 7 days from now
    setExpireTime(tockenExpirationDate); 
    localStorage.setItem('userData', JSON.stringify({ userId: uid, token: token, expirationDate: tockenExpirationDate })); 
    // store the userId, token & expirationDate in local storage
    // cannot store the object directly in local storage 
  }, []); // useCallback is used to prevent the function from being recreated on every render cycle 
  
  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem('userData')); // get the userId and token from local storage
    if(storedData && storedData.token && new Date(storedData.expirationDate) > currentTime) { // check if the token is valid
      login(storedData.userId, storedData.token, storedData.expirationDate); // call the login function
    }
  },[login])

  const logout = useCallback(() => { 
    setToken(null); 
    setUserId(null); 
    setExpireTime(null);
    localStorage.removeItem('userData'); // remove the userId and token from local storage
  }
  , []); 

  useEffect(()=>{
    if(token && expireTime) { // check if the token is valid
      const remainingTime = new Date(expireTime).getTime() - currentTime; // get the remaining time
      setTimeout(() => { // set a timeout to logout the user after the expiration date
        logout(); // call the logout function
      }, remainingTime); 
    }
  },[expireTime, token, logout])
  return{login, logout, token, userId};
}