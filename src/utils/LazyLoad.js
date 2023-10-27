import React from 'react'

function LazyLoad(path){
	const Comp = React.lazy(()=>import(/* @vite-ignore */ `../${path}`))
	return ( 
		<React.Suspense>
			<Comp/>
		</React.Suspense>
	)
}


export default LazyLoad