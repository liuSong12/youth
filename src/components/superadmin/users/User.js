import { Selector } from "antd-mobile"
import { useState } from "react"
import WorkerList from "../workerlist/workerList"
import AllUser from "./alluser/AllUser"

export default function User(){
	const [tag,settag] = useState('1')
	const options = [
	  {
	    label: '所有用户',
	    value: '1',
	  },
	  {
	    label: '快递员',
	    value: '2',
	  },
	  {
	    label: '小黑屋',
	    value: '3',
	  },
	]
	
	return (
	<>
		<Selector style={{'--color':'white',"background":'white','--padding':'4px',position:"sticky",top:'50px',zIndex:10}} columns={3} options={options} defaultValue={['1']} onChange={arr => settag(arr[0])}/>
		{tag=='1' && <AllUser/>}
		{tag=='2' &&  <WorkerList/>}
		{tag=='3' &&  <WorkerList black={true}/>}
	</>
	)
}