import { Link } from 'react-router-dom';
import { useContext, Fragment } from 'react';
import classes from './MainNavigation.module.css';
import AuthContext from '../../store/auth-context';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = (event) => {
    event.preventDefault();
    authCtx.logout();
  }

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn &&
            <li>
              <Link to='/auth'>Login</Link>
            </li>
          }
          {isLoggedIn &&
            <Fragment>
              <li>
                <Link to='/profile'>Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </Fragment>
          }
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
