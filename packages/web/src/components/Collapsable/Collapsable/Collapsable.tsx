import useCollapsed from '../../../hooks/useCollapsed';
import styles from './Collapsable.module.scss';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { mc } from '../../../helpers';
import React, { useRef } from 'react';

const Collapsable = (
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => {
	const { collapsed } = useCollapsed();
	const containerRef = useRef<HTMLDivElement>(null);
	return (
		<div
			{...props}
			ref={containerRef}
			className={mc(props.className, {
				[styles.collapsed]: collapsed,
				[styles.collapsable]: true,
			})}
			style={
				!collapsed
					? { maxHeight: containerRef.current?.scrollHeight + 'px' }
					: {}
			}
		/>
	);
};

export default Collapsable;
