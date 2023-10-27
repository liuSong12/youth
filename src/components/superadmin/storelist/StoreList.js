import { Avatar, Card, Tag,Button, InfiniteScroll, Modal} from "antd-mobile"
import { AntOutline,RightOutline} from 'antd-mobile-icons'
import axios from "axios"
import {useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import GlobalConfig from "../../../GlobalConfig"
import styles from "../../store/store.module.css"


export default function(){
	const [list,setList] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const page = useRef(0)
	const navigate = useNavigate()
	
	async function loadMore() {
	    const append = await axios(`/manage/getStore?page=${page.current}`).then(res=>res.data)
	    setList([...list, ...append.data])
	    setHasMore(append.data.length > 0)
		page.current++
	}
	
	const onHeaderClick = (e)=>{
		navigate(`/storeDetail/${e.id}/${e.storeName}`)
	}
	
	const handleClick =  (item)=>{
		//0：打烊，1：工作,2:审核中
		
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let res = await axios.patch(`/manage/updateStoreStatue?status=${item.storeStatus}&id=${item.id}`).then(res=>res.data)
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
	
	const changeShow = (item)=>{
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let res = await axios.patch(`/manage/setStoreShow?showStatus=${item.showStatus?"1":"null"}&id=${item.id}`).then(res=>res.data)
				if(res.code!==1) return;
				setList([])
				page.current=0
				setHasMore(true)
			}
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
				} extra={<RightOutline />} onHeaderClick={()=>onHeaderClick(item)} style={{ borderRadius: '16px' }}>
		  <div className={styles.content}>
				<div style={{padding:"3px",display:'flex',flexWrap:"wrap"}}>
					{
						item.storeImgArr.split(",").map(e=><Avatar onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/storeImg/"+e)} src={GlobalConfig.DEFAULT_URL+"/images/storeImg/"+e}  style={{ '--size': '30px' }}/>)
					}
					
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>商店名称:</div>
						<div>{item.storeName}</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>负责人姓名:</div>
						<div>{item.responseName}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>负责人电话:</div>
						<div>{item.responsePhone}</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>打包费:</div>
						<div>￥{item.packagePrice}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>商店状态:</div>
						<div>
							{item.storeStatus==0&&<Tag color="primary">已打烊</Tag>}
							{item.storeStatus==1&&<Tag color="success" >工作中</Tag>}
							{item.storeStatus==2&&<Tag color='warning'>审核中</Tag>}
						</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>标语:</div>
						<div>{item.notice||"暂未设置标语"}</div>
					</div>
				</div>
		  </div>
		  <div className={styles.footer} onClick={e => e.stopPropagation()}>
				<Button size="mini" color={item.storeStatus==2?'warning':'primary'} onClick={() => {handleClick(item)}}>
					{item.storeStatus==2?'通过审核':'再审核'}
				</Button>
				<Button size="mini" color={item.showStatus==null?'success':'warning'} onClick={() => {changeShow(item)}}>
					{item.showStatus==1?'展示出来':'不展示'}
				</Button>
		  </div>
		</Card>)
		}
		<InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
	</>
	)
}