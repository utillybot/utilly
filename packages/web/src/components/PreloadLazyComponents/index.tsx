import { memo, useEffect, useState } from 'react';
import { routes } from '../../main/routes';

const Index = (): JSX.Element => {
	const [actPreload, setActPreload] = useState(true);
	useEffect(() => {
		const t = setTimeout(() => {
			setActPreload(false);
		}, 3000);
		return () => clearTimeout(t);
	});

	if (actPreload)
		return (
			<div hidden>
				{routes.map(route => {
					const Page = route.page;
					return <Page preload key={route.path} />;
				})}
			</div>
		);
	return <></>;
};

export default memo(Index);
