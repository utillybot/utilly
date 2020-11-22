import { mc } from '../../../helpers';
import styles from './index.module.scss';
import useCollapsed from '../CollapsableContext/useCollapsed';

const generateSVG = (
	x: number,
	y: number,
	l: number,
	collapsed: boolean
): JSX.Element => {
	return (
		<path
			key={`${x},${y} ${l}`}
			className={mc(styles.line, {
				[styles.collapsed]: collapsed,
				[styles.open]: !collapsed,
			})}
			d={`M ${x},${y} h${l}`}
		/>
	);
};

const Hamburger = (): JSX.Element => {
	const { collapsed, setCollapsed } = useCollapsed();
	return (
		<button
			className={styles.hamburger}
			aria-label="Toggle Collapsable"
			onClick={() => setCollapsed(prevState => !prevState)}
		>
			<svg viewBox="0 0 10 10" width="30" height="30">
				{[
					[1, 2, 8],
					[1, 5, 8],
					[1, 8, 8],
				].map(i => generateSVG(i[0], i[1], i[2], collapsed))}
			</svg>
		</button>
	);
};

export default Hamburger;
