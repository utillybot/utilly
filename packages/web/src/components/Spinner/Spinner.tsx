import React from 'react';
import './Spinner.module.scss';

const Spinner = (): JSX.Element => {
	return (
		<>
			<div styleName="container">
				<h1>Loading...</h1>
				<div styleName="spinner" />
			</div>
		</>
	);
};

export default Spinner;
