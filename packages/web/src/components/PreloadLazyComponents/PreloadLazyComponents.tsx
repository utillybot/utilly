import { memo, useEffect, useState } from 'react';
import { routes } from '../../routes';

const PreloadLazyComponents = (): JSX.Element => {
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
					if (route.preLoad == false) return null;
					const Page = route.page;
					return <Page preload key={route.path} />;
				})}
			</div>
		);
	return <></>;
};

export default memo(PreloadLazyComponents);
