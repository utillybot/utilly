import type { ReactNode } from 'react';
import { Component } from 'react';
import styles from './CommandsErrorBoundary.module.scss';
import * as Sentry from '@sentry/react';

interface CommandsErrorBoundaryState {
	hasError: boolean;
}
export class CommandsErrorBoundary extends Component<
	unknown,
	CommandsErrorBoundaryState
> {
	public state = { hasError: false };

	static getDerivedStateFromError(): CommandsErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error): void {
		Sentry.captureException(error);
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
