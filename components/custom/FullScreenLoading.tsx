import { Box, CircularProgress, Typography } from '@mui/material'

export const FullScreenLoading = () => {
	return (
		<Box
			display='flex'
			alignItems='center'
			justifyContent='center'
			flexDirection='column-reverse'
			height='calc(100vh - 200px)'
		>
			<Typography sx={{ mt: 2 }} variant='h2' fontWeight={200} fontSize={20}>
				Cargando...
			</Typography>
			<CircularProgress thickness={2} />
		</Box>
	)
}
