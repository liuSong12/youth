import {Selector} from "antd-mobile"
import axios from "axios"
import { useEffect, useState } from "react"
import IndexNotice from "./indexnotice/IndexNotice"
import SwiperNotice from "./swipernotice/SwiperNotice"

export default function Notice(){
	const [tag,settag] = useState('1')
	const [notice,setNotice] = useState([])
	const [swiper,setSwiper] = useState([])
	
	async function getNotice(){
		let res = await axios("/manage/getnotice").then(res=>res.data)
		if(res.code!==1) return;
		setNotice(res.data.noticeList)
		setSwiper(res.data.swiperList)
	}
	
	useEffect(()=>{
		getNotice()
	},[])
	
	const options = [
	  {
	    label: '通知条',
	    value: '1',
	  },
	  {
	    label: 'swiper',
	    value: '2',
	  }
	]
	
	return (
	<>
		<Selector style={{'--color':'white',"background":'white','--padding':'4px',position:"sticky",top:'50px',zIndex:10}} columns={2} options={options} defaultValue={['1']} onChange={arr => settag(arr[0])}/>
		{tag=="1" && <IndexNotice notice={notice} getNotice={getNotice}/>}
		{tag=="2" && <SwiperNotice swiper={swiper} getNotice={getNotice}/>}
	</>
	)
}