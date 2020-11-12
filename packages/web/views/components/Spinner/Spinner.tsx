import React, { Fragment } from 'react';
import './Spinner.scss';

const Spinner = (): JSX.Element => {
    return (
        <Fragment>
            <div className="spinner-container">
                <h1>Loading...</h1>
                <div className="spinner" />
            </div>
        </Fragment>
    );
};

export default Spinner;
