import styles from './Spinner.module.scss';

const Spinner = (): JSX.Element => {
	return (
		<div className={styles.container}>
			<div className={styles.spinner} />
		</div>
	);
};

export default Spinner;
