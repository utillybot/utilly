import React, { Suspense } from 'react';
import './Commands.scss';
import { Switch, Route } from 'react-router-dom';
import CommandModulesPage from './pages/CommandModulesPage/CommandModulesPage';
import CommandModulePage from './pages/CommandModulePage/CommandModulePage';
import CommandPage from './pages/CommandPage/CommandPage';
import { get } from '../../API';
import Spinner from '../../components/Spinner/Spinner';

const commandResource = get().commands;

const Commands = (): JSX.Element => {
    return (
        <Suspense fallback={<Spinner />}>
            <div className="page-commands">
                <header>
                    <h2>View all the commands for Utilly!</h2>
                </header>
                <Switch>
                    <Route exact path={'/commands'}>
                        <CommandModulesPage resource={commandResource} />
                    </Route>

                    <Route exact path={'/commands/:module'}>
                        <CommandModulePage resource={commandResource} />
                    </Route>

                    <Route exact path={'/commands/:module/:command'}>
                        <CommandPage resource={commandResource} />
                    </Route>
                </Switch>
            </div>
        </Suspense>
    );
};

export default Commands;
