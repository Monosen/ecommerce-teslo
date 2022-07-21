import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
// import { jwtVerify } from 'jose'
// import { jwt } from '../../utils'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

	const url = req.nextUrl.clone()
	url.basePath = '/auth/login?p='
	url.pathname = req.page.name!

	if (!session) {
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
	// const url = req.nextUrl.clone()
	// url.basePath = '/auth/login?p='
	// url.pathname = req.page.name!
	// const { token = '' } = req.cookies
	// try {
	// 	// await jwt.isValidToken(token)
	// 	await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
	// 	return NextResponse.next()
	// } catch (error) {
	// 	return NextResponse.redirect(url)
	// }
}
