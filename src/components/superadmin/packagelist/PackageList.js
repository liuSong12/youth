import { Selector } from "antd-mobile"
import { useState } from "react"
import MyCardPackage from "../../package/MyCardPackage"

export default function User(){
	const [tag,settag] = useState('1')
	const options = [
	  {
	    label: '所有订单',
	    value: '1',
	  },
	  {
	    label: '正在派送',
	    value: '2',
	  }
	]
	
	return (
	<>
		<Selector
		style={{'--color':'white',"background":'white','--padding':'4px',position:"sticky",top:'50px',zIndex:10}}
		 columns={2}
		  options={options}
		  defaultValue={['1']}
		  onChange={arr => settag(arr[0])}
		/>
		{tag=='1' && <MyCardPackage status={10}/>}
		{tag=='2' &&  <MyCardPackage status={1} SuperSending={1}/>}
	</>
	)
}