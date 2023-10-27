import { Card, Button,Toast,Avatar,Tag,Empty, InfiniteScroll,Modal } from 'antd-mobile'
import { AntOutline, RightOutline } from 'antd-mobile-icons'
import { useEffect, useRef, useState } from 'react'
import styles from "./store.module.css"
import moment from "moment"
import GlobalConfig from "../../GlobalConfig"
import axios from 'axios'
import { connect } from 'react-redux'
import Model from "../Model"
import ioWatch from '../../utils/ioconfig'

function CustomCard(props){
	const [isShow,setIsShow] = useState(false)
	const [temp,settemp] = useState(null)
	const [list,setList] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const page = useRef(0)
	
	const setsrc = (image)=>{
		 Modal.alert({
			image
		})
	}
	
	async function loadMore() {
		//staus 0:sending undefind:所有订单
		const res = await axios(`/manage/getsending?status=${props.type}&page=${page.current}`).then(res=>res.data)
		if(res.code!==1) return;
		setList([...list, ...res.data])
		setHasMore(res.data.length > 0)
		page.current++
	}
	
	useEffect(()=>{
		ioWatch ("newStoreOrder",(msg)=>{
			if(props.info.responsePhone==msg.phone){
				props.changeStoreNum(msg.num)
				setList([])
				page.current = 0
				setHasMore(true)
			}
		})
	},[])
	
	
	
	
	const handleFinsh = (item,status)=>{
		// 1送达，2退款
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let arr = item.list.map(item=>({
					saleNum:item.saleNum+item.num,
					id:item.commondityId
				}))
				if(status){
					Toast.show({
						icon: 'loading',
						content: '加载中…',
						duration:10000
					})
					let res = await axios.patch(`/manage/updateStatus?address=${item.address}&totalPrice=${item.totalPrice}&timestamp=${item.timestamp}&userId=${item.userId}&status=${status}`,{sale:arr}).then(res=>res.data)
					if(res.code!==1) return;
					setList([])
					page.current = 0
					setHasMore(true)
					Toast.clear()
				}else{
					settemp({address:item.address,totalPrice:item.totalPrice,timestamp:item.timestamp,userId:item.userId,sale:arr,status:status})
					setIsShow(true)
				}
			},
		})
		
	}
	
	const upload = async (fileStr)=>{
		if(fileStr==""){
			Toast.show({
				content: '请上传图片',
				position: 'top'
			})
			return
		}
		Toast.show({
			icon: 'loading',
			content: '加载中…',
			duration:10000
		})
		let res = await axios.patch(`/manage/updateStatus?address=${temp.address}&totalPrice=${temp.totalPrice}&timestamp=${temp.timestamp}&userId=${temp.userId}&status=${temp.status}&file=${fileStr}`,{sale:temp.sale}).then(res=>res.data)
		if(res.code!==1) return;
		setIsShow(false)
		setList([])
		page.current = 0
		setHasMore(true)
		Toast.clear()
	}
	
	
	return (
		<>
			{isShow && <Model hide={()=>setIsShow(false)} upload={upload}/>}
			{list.length==0 && <Empty description='暂无数据' />}
			{
				list.map(item=><Card
				key={item.createTime}
			   title={
				 <div style={{ fontWeight: 'normal' }}>
				   <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
				   下单时间:{moment(item.createTime).format("yyyy/MM/DD HH:mm:ss")}
				 </div>
			   }
			   style={{ borderRadius: '16px' }}
			 >
			   <div className={styles.content}>
					<div style={{padding:"3px",display:'flex',flexWrap:"wrap"}}>
						{
							item.list.map(e=>(<Avatar key={e.commondityimg} src={GlobalConfig.DEFAULT_URL+"/images/commondityImg/"+e.commondityimg} onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/commondityImg/"+e.commondityimg)}  style={{ '--size': '30px' }}/>))
						}
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>送货地址:</div>
							<div>{item.address}</div>
						</div>
						<div className={styles.rowitemlist}>
							<div>实付:</div>
							<div>￥{item.totalPrice}</div>
						</div>
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>顾客电话:</div>
							<div>{item.customPhone}</div>
						</div>
						{
							props.type==10&&<div className={styles.rowitemlist}>
							<div>商店id:</div>
							<div>{item.SuperStoreID}</div>
						</div>
						}
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>订单状态:</div>
							<div>
								{item.status==0&&<Tag color='primary'>派送中</Tag>}
								{item.status==1&&<Tag color='success'>已送达</Tag>}	
								{item.status==2&&<Tag color='warning'>已退款</Tag>}
							</div>
						</div>
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist} style={{flexWrap:"wrap"}}>
							<div>
								商品名称与数量:
							</div>
							<div style={{flexWrap:"wrap"}}>
								{item.list.map(e=>{
									return <div style={{margin:"0 0.15rem"}}>{e.commondityName}<span style={{color:"red"}}>x{e.num}</span></div>
								})}
							</div>
						</div>
					</div>
					<div className={styles.rowitem}>
						{
							item.finishImg && <div className={styles.rowitemlist} style={{alignItems:"flex-start"}}>
								<div>
									送达照片:
								</div>
								<div style={{padding:"3px",display:'flex',flexWrap:"wrap"}}>
									{
										  item.finishImg.split(",").map(e=>(
										<Avatar key={e} onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/commondityImg/"+e)} src={GlobalConfig.DEFAULT_URL+"/images/commondityImg/"+e}  style={{ '--size': '30px' }}/>
										))
									}
								</div>
							</div>
						}
					</div>
			   </div>
			   <div className={styles.footer} onClick={e => e.stopPropagation()}>
				 {
					 item.status==0 && <Button size="mini" color="primary" onClick={() => {handleFinsh(item,1)}}>
					   已送达,通知取件
					 </Button>
				 }
				 <Button size="mini" color="warning" onClick={() => {handleFinsh(item)}}>
				    上传照片
				 </Button>
				 {item.status!=2&&<Button size="mini" color="danger" onClick={() => {handleFinsh(item,2)}}>
				   退款
				 </Button>
				 }
			   </div>
			 </Card>)
			}
			<InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
		</>
	)
}

const mapDispathToProps = {
	changeStoreNum(payload){
		return {
			type:"change-storenum",
			payload
		}
	}
}


const mapStateToProps = (state)=>{
	return {
		info:state.GlobalStoreReducer.storeInfo
	}
}

export default connect(mapStateToProps,mapDispathToProps)(CustomCard)