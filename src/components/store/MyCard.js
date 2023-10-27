import { Card,Avatar,Button,Empty,Tag, InfiniteScroll, Modal} from 'antd-mobile'
import { AntOutline, RightOutline } from 'antd-mobile-icons'
import styles from "./store.module.css"
import {useNavigate} from "react-router-dom"
import { connect } from 'react-redux'
import axios from 'axios'
import GlobalConfig from '../../GlobalConfig'
import { useEffect, useRef, useState } from 'react'

function MyCard(props){
	const navigate = useNavigate()
	const [list,setList] = useState([])
    const [hasMore, setHasMore] = useState(true)
	const page = useRef(0)
	
	async function getOrder(){
		return axios(`/manage/getOrder?SuperStoreId=${props.storeId}&status=${props.status}&type=${props.super}&page=${page.current}`).then(res=>res.data)
	}
	
	async function loadMore() {
	    const append = await getOrder()
	    setList([...list, ...append.data])
	    setHasMore(append.data.length > 0)
		page.current++
	}
	
	const setsrc = (image)=>{
		 Modal.alert({
			image
		})
	}
	
	
	const onHeaderClick = (obj)=>{
		props.changDetail({...obj,flag:props.super!=undefined})
		navigate("/detail")
	}
	
	const handleClick = async(item)=>{
		let resStatus = await axios.patch(`/manage/setstatus?id=${item.id}&status=${item.commonditystatus==0?1:0}`).then(res=>res.data)
		if(resStatus.code!==1) return;
		setList([])
		page.current = 0
		setHasMore(true)
	}
	
	const handleDelete = (item)=>{
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let resStatus = await axios.delete(`/manage/deletecom/${item.id}`).then(res=>res.data)
				if(resStatus.code!==1) return;
				setList([])
				page.current = 0
				setHasMore(true)
			}
		})
	}
	
	return (
	<>
		{list.length==0 && <Empty description='暂无数据' />}
		{
			list.map(item=><Card
				key={item.id}
			   title={
				 <div style={{ fontWeight: 'normal' }}>
				   <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
				   {item.commondityName}
				 </div>
			   }
			   extra={<RightOutline />}
			   onHeaderClick={()=>onHeaderClick(item)}
			   style={{ borderRadius: '16px' }}
		 >
		   <div className={styles.content}>
				<div style={{padding:"3px 0"}}>
					<Avatar onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/commondityImg/"+item.commondityimg)} src={GlobalConfig.DEFAULT_URL+"/images/commondityImg/"+item.commondityimg}  style={{ '--size': '30px' }}/>
				</div>
				{
					props.super && <div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>商品id:</div>
							<div>{item.id}</div>
						</div>
						<div className={styles.rowitemlist}>
							<div>商店id:</div>
							<div>{item.storeId}</div>
						</div>
					</div>
				}
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>商品名称:</div>
						<div>{item.commondityName}</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>商品价格:</div>
						<div>￥{item.commondityPrice}</div>
					</div>
				</div>
				<div className={styles.rowitem}>
					<div className={styles.rowitemlist}>
						<div>售卖状态:</div>
						<div>
							{item.commonditystatus==0&&<Tag color='primary'>已起售</Tag>}
							{item.commonditystatus==1&&<Tag color='success'>已停售</Tag>}	
						</div>
					</div>
					<div className={styles.rowitemlist}>
						<div>已售:</div>
						<div>{item.saleNum}</div>
					</div>
				</div>
		   </div>
		   <div className={styles.footer} onClick={e => e.stopPropagation()}>
			 <Button size="mini" color={item.commonditystatus==0?'danger':'warning'} onClick={() => {handleClick(item)}}>
			   {item.commonditystatus==0?'停售':'起售'}
			 </Button>
			 <Button size="mini" color="danger" onClick={() => {handleDelete(item)}}>
			   删除
			 </Button>
		   </div>
		 </Card>)
		}
		<InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
	</>
	)
}

const mapDispatchToProps = {
	changDetail(payload){
		return {
			type:"changeDetail",
			payload
		}
	}
}

export default connect(null,mapDispatchToProps)(MyCard)