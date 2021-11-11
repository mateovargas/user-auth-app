import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import classes from './ProfileForm.module.css';
import config from '../../config.json';
import AuthContext from '../../store/auth-context';
const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;
    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + config.firebaseAPIKey
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async (res) => {
        if (res.ok) {
          alert('Password updated!');
          history.replace('/');
        }
        else {
          const data = await res.json();
          console.log(data);
          let errorMessage = 'Authentication failed, password not reset!';
          if (data & data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          alert(errorMessage);
        }
      });
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
