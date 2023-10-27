import { Avatar, Card, Tag, InfiniteScroll,Modal} from "antd-mobile"
import { AntOutline} from 'antd-mobile-icons'
import axios from "axios"
import {useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../../../store/store.module.css"
import moment from "moment"
import GlobalConfig from "../../../../GlobalConfig"


export default function(){
	const [list,setList] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const page = useRef(0)
	
	async function loadMore() {
	    const append = await axios(`/manage/getallUser?page=${page.current}`).then(res=>res.data)
		console.log(append,"alluser")
	    setList([...list, ...append.data])
	    setHasMore(append.data.length > 0)
		page.current++
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
				}  style={{ borderRadius: '16px' }}>
		  <div className={styles.content}>
				<div style={{padding:"3px",display:'flex',flexWrap:"wrap"}}>
					{item.avatar && <Avatar onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/avatar/"+item.avatar)} src={GlobalConfig.DEFAULT_URL+"/images/avatar/"+item.avatar}  style={{ '--size': '30px' }}/>}
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>id:</div>
						<div>{item.id}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>微信名称:</div>
						<div>{item.nikeName||"未设置名称"}</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>电话号码:</div>
						<div>{item.phone}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>身份状态:</div>
						<div>
							{item.identity == 0 && <Tag color='primary'>普通人</Tag>}
							{item.identity == 1 && <Tag color='success'>快递员</Tag>}
							{item.identity == 2 && <Tag color='danger'>小黑屋</Tag>}
							{item.identity == 3 && <Tag color='warning'>审核中</Tag>}
						</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>下单量:</div>
						<div>{item.orderNumber}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>接单量:</div>
						<div>{item.receiveNumber}</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>上次操作时间:</div>
						<div>{moment(item.lastOperateTime).format("yyyy-MM-DD HH:mm:ss")}</div>
					</div>
				</div>
		  </div>
		</Card>)
		}
		<InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
	</>
	)
}