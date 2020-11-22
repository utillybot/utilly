import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { mc } from '../../helpers';
import styles from './index.module.scss';

const Button = (props: LinkProps): JSX.Element => {
	return <Link {...props} className={mc(props.className, styles.button)} />;
};

export default Button;
