import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import React from 'react';
import styles from './Page.module.scss';
import { mc } from '../../helpers';

const Page = (
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => {
	return <div {...props} className={mc(props.className, styles.page)} />;
};

export default Page;
