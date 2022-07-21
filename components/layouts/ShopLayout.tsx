import { FC, PropsWithChildren } from 'react'
import Head from 'next/head'
import { Navbar, SideMenu } from '../custom'

interface Props {
	title: string
	pageDescription: string
	imageFullUrl?: string
}

export const ShopLayout: FC<PropsWithChildren<Props>> = ({
	title,
	pageDescription,
	imageFullUrl,
	children
}) => {
	return (
		<>
			<Head>
				<title>{title || 'TesloShop'}</title>
				<meta name='description' content={pageDescription} />

				<meta name='og:title' content={title} />
				<meta name='og:description' content={title} />

				{imageFullUrl && <meta name='og:image' content={imageFullUrl} />}
			</Head>

			<nav>
				<Navbar />
			</nav>

			<SideMenu />

			<main
				style={{ margin: '80px auto', maxWidth: '1440px', padding: '0px 30px' }}
			>
				{children}
			</main>

			<footer></footer>
		</>
	)
}
