import type { ReactNode } from 'react';
import { Component } from 'react';
import styles from './index.module.scss';

interface CommandsErrorBoundaryState {
	hasError: boolean;
}
class ErrorBoundary extends Component<unknown, CommandsErrorBoundaryState> {
	public state = { hasError: false };

	static getDerivedStateFromError(): CommandsErrorBoundaryState {
		return { hasError: true };
	}

	render(): JSX.Element | ReactNode {
		if (this.state.hasError) {
			return (
				<div className={styles.error}>
					<h1>Something went wrong when loading the commands.</h1>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
