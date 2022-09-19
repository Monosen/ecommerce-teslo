import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { lightTheme } from '../themes'
import { CustomProvider, CartProvider, AuthProvider } from '../context'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session} basePath='/api/auth'>
			<PayPalScriptProvider
				options={{
					'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
				}}
			>
				<SWRConfig
					value={{
						fetcher: (resource, init) =>
							fetch(resource, init).then(res => res.json())
					}}
				>
					<AuthProvider>
						<CartProvider>
							<CustomProvider>
								<ThemeProvider theme={lightTheme}>
									<CssBaseline />
									<Component {...pageProps} />
								</ThemeProvider>
							</CustomProvider>
						</CartProvider>
					</AuthProvider>
				</SWRConfig>
			</PayPalScriptProvider>
		</SessionProvider>
	)
}

export default MyApp
