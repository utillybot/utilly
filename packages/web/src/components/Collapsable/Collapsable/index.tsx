import useCollapsed from '../CollapsableContext/useCollapsed';
import styles from './index.module.scss';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { mc, ms } from '../../../helpers';
import { useRef } from 'react';

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
			style={ms(
				props.style,
				!collapsed
					? { maxHeight: containerRef.current?.scrollHeight + 'px' }
					: undefined
			)}
		/>
	);
};

export default Collapsable;
