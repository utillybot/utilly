import React, { Suspense, Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ROUTE_CONSTANTS } from '../../ROUTE_CONSTANTS';
import './Routes.sass';
import Spinner from '../Spinner/Spinner';

class Routes extends Component<RouteComponentProps> {
    render() {
        const routes: JSX.Element[] = [];
        for (const pageRoute of ROUTE_CONSTANTS) {
            routes.push(
                <Route
                    exact={pageRoute.exact ?? true}
                    key={pageRoute.name}
                    path={pageRoute.path}
                    component={pageRoute.page}
                />
            );
        }
        const location = this.props.location;
        return (
            <div className="page">
                <Suspense fallback={Spinner}>
                    <Switch location={location}>{routes}</Switch>
                </Suspense>
            </div>
        );
    }
}

export default withRouter(Routes);
