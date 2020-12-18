import React, { lazy, memo, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import HomePage from './home';

const DetailsPage = lazy(() =>
  import(/* webpackChunkName: "details-page" */ './details')
);

const Pages = memo(() => {
  return (
    <Router>
      <Suspense fallback=''>
        <Switch>
          <Route
            path='/:id'
            exact
            render={props => {
              const { match } = props;
              const id = Number(match.params?.id);
              if (Number.isNaN(id)) {
                return <Redirect to='/' />;
              }
              return <DetailsPage {...props} />;
            }}
          />
          <Route path='/' component={HomePage} />
        </Switch>
      </Suspense>
    </Router>
  );
});

export default Pages;
