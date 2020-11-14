import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import React from 'react';
import styles from './Page.module.scss';

const Page = (
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => {
	return (
		<div
			{...props}
			className={
				props.className ? props.className + ' ' + styles.page : styles.page
			}
		/>
	);
};

export default Page;
