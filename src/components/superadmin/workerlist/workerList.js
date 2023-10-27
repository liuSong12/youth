import { Avatar, Card, Tag,Button, InfiniteScroll, Modal} from "antd-mobile"
import { AntOutline} from 'antd-mobile-icons'
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import GlobalConfig from "../../../GlobalConfig"
import styles from "../../store/store.module.css"


export default function({black}){
	const [list,setList] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const page = useRef(0)
	
	async function loadMore() {
	    const append = await axios(`/manage/getworker?page=${page.current}&black=${black}`).then(res=>res.data)
	    setList([...list, ...append.data])
	    setHasMore(append.data.length > 0)
		page.current++
	}
	
	
	const handleClick = (item,status)=>{
		
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let flag = item.identity == 2 ? 1:0// '小黑屋':"非"
				let res = await axios.patch(`/manage/update?flag=${flag}&workerId=${item.id}&id=${item.userId}&status=${status}`).then(res=>res.data)
				if(res.code!==1) return;
				setList([])
				page.current=0
				setHasMore(true)
			}
		})
	}
	
	const setsrc = (image)=>{
		 Modal.alert({
			image
		})
	}
	
	
	return (
	<>
		{
			list.map(item=><Card key={item.id}
				title={
					 <div style={{ fontWeight: 'normal' }}>
					   <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
					   id:{item.id}
					 </div>
				} style={{ borderRadius: '16px' }}>
		  <div className={styles.content}>
				<div style={{padding:"3px",display:'flex',flexWrap:"wrap"}}>
					<Avatar onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/workerImg/"+item.studentImg)} src={GlobalConfig.DEFAULT_URL+"/images/workerImg/"+item.studentImg}  style={{ '--size': '30px' }}/>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>工作姓名:</div>
						<div>{item.wokerName}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>工作电话:</div>
						<div>{item.workerPhone}</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>接单量:</div>
						<div>{item.receiveNumber}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>下单量:</div>
						<div>{item.orderNumber}</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>微信电话:</div>
						<div>{item.phone}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>状态:</div>
						<div>
							{item.identity==1&&<Tag color='primary'>快递员</Tag>}
							{item.identity==2&&<Tag color="danger" >小黑屋</Tag>}
							{item.identity==3&&<Tag color='warning'>审核中</Tag>}
						</div>
					</div>
				</div>
		  </div>
		  <div className={styles.footer} onClick={e => e.stopPropagation()}>
			 {item.identity==3&&
			 <Button size="mini" color="danger" onClick={() => {handleClick(item,1)}}>
				通过审核
			 </Button>
			 }
			 {
				 item.identity == 1 &&
				 <Button size="mini" color="danger" onClick={() => {handleClick(item,0)}}>
				 	撤职
				 </Button>
			 }
			 <Button size="mini" color={item.identity==2?"danger":"warning"} onClick={() => {handleClick(item)}}>
			 	{item.identity==2?"放出来":"关起来"}
			 </Button>
		  </div>
		</Card>)
		}
		<InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
	</>
	)
}