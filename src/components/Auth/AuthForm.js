import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import config from '../../config.json';
import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory()
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    console.log(isLogin);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    let url;
    if(isLogin){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + config.firebaseAPIKey;
      fetch(url,
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(async (res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          }
          else {
            const data = await res.json();
            console.log(data);
            let errorMessage = 'Authentication failed';
            if (data & data.error && data.error.message) {
              errorMessage = data.eror.message;
            }
            alert(errorMessage);
            throw new Error(errorMessage);
          }
        })
        .then((data) => {
          const expirationTime = new Date(new Date().getTime() + (data.expiresIn * 1000));
          authCtx.login(data.idToken, expirationTime.toISOString());
          history.replace('/');
        })
        .catch((err) => {
          alert(err.message);
        });
    }
    else{
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + config.firebaseAPIKey
      fetch(url, 
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async (res) => {
        setIsLoading(false);
        if(res.ok){
          alert('Account created successfully!');
          setIsLogin(true);
        }
        else{
          const data = await res.json();
          console.log(data);
          let errorMessage = 'Authentication failed';
          if(data & data.error && data.error.message){
            errorMessage = data.eror.message;
          }
          alert(errorMessage);
        }
      });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;