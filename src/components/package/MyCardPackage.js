import { Card,Avatar,Button,Toast, Tag,Empty, InfiniteScroll, Modal } from 'antd-mobile'
import { AntOutline } from 'antd-mobile-icons'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import styles from "../store/store.module.css"
import moment from "moment"
import GlobalConfig from "../../GlobalConfig"
import Model from "../Model"
import { connect } from 'react-redux'
import ioWatch from "../../utils/ioconfig.js"


function MyCardPackage({status,SuperSending,changePackageNum}){
	const [list,setList] = useState([])
	const [isShow,setIsShow] = useState(false)
	const [myId,setMyId] = useState()
	const [userId,setUserId] = useState()
	const [address,setAddress] = useState("")
	const [totalMoney,setMoney] = useState("")
	
	const [hasMore, setHasMore] = useState(true)
	const page = useRef(0)
	
	useEffect(()=>{
		ioWatch("newPackage",(msg)=>{
			changePackageNum(msg)
			setList([])
			page.current = 0
			setHasMore(true)
		})
	},[])
	
	const setsrc = (image)=>{
		 Modal.alert({
			image
		})
	}
	
	async function loadMore() {
	    const res = await getOrder()
		if(res.code!==1) return;
		setList([...list,...res.data])
		page.current++
	    setHasMore(res.data.length > 0)
	}
	
	function getOrder(){
		return axios(`/manage/getpackage?SuperSending=${SuperSending}&status=${status}&page=${page.current}`).then(res=>res.data)
	}
	
	const handleClick= (item)=>{
		/*	0:接单
			1:通知取件
		*/
	   
	   Modal.confirm({
	   	content: '确认后执行',
	   	onConfirm:async () => {
			setUserId(item.userId)
			setMyId(item.id)
			setAddress(item.address)
			setMoney(item.money)
			if(item.status==0){
					   let res = await axios.patch(`/manage/updatePackage?status=1&orderId=${item.id}`).then(res=>res.data)
					   if(res.code!==1) return;
					   if(res.code==0){
						   Toast.show({
						   	content: res.msg,
						   	position: 'top'
						   })
					   }
					   setList([])
					   page.current = 0
					   setHasMore(true)
			}else{
					   setIsShow(true)
			}
	   	}
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
		let res = await axios.patch(`/manage/updatePackage?status=2&orderId=${myId}&file=${fileStr}&userId=${userId}&address=${address}&totalmoney=${totalMoney}`).then(res=>res.data)
		if(res.code!==1) return;
		setIsShow(false)
		setList([])
		page.current = 0
		setHasMore(true)
		Toast.clear()
	}
	
	const repei = (item)=>{
		Modal.confirm({
			content: '确认后执行',
			onConfirm: () => {
				axios.patch(`/manage/repei?id=${item.id}`).then(res=>{
					if(res.data.code!==1) return;
					setList([])
					page.current = 0
					setHasMore(true)
				})
			}
		})	
	}
	
	return (
		<>
			{isShow && <Model hide={()=>setIsShow(false)} upload={upload} uploadImg="uploadpackageImg"/>}
			{list.length==0 && <Empty description='暂无数据' />}
			<div style={{paddingBottom:"1.1rem"}}>
			{
				list.map(item=><Card
					   title={
						 <div style={{ fontWeight: 'normal' }}>
						   <div>
								<div>雇主id:{item.userId}</div>
								<div>下单时间:{moment(item.orderTime).format("yyyy/MM/DD HH:mm:ss")}</div>
						   </div>
						 </div>
					   }
					   key={item.orderTime}
					   style={{ borderRadius: '16px' }}
					 >
			   <div className={styles.content}>
					<div style={{padding:"3px 0",display:"flex",flexWrap:'wrap'}}>
						{
							item.orderImgArr && item.orderImgArr.split(",").map(e=><Avatar key={e} src={GlobalConfig.DEFAULT_URL+"/images/orderImg/"+e} onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/orderImg/"+e)} style={{ '--size': '30px',margin:'2px 10px' }}/>)
						}
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>数量:</div>
							<div>{item.number}个</div>
						</div>
						<div className={styles.rowitemlist}>
							<div>重量:</div>
							<div>{item.weight}斤</div>
						</div>
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>金额:</div>
							<div>{item.money}元</div>
						</div>
						<div className={styles.rowitemlist}>
							<div>送单地址:</div>
							<div>{item.address}</div>
						</div>
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>微信电话:</div>
							<div>{item.phone}</div>
						</div>
						<div className={styles.rowitemlist}>
							<div>地址电话:</div>
							<div>{item.addressphone}</div>
						</div>
					</div>
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>订单状态:</div>
							{item.status==0 && <Tag color="primary">无人接单</Tag>}
							{item.status==3 && <Tag color="warning">已退款</Tag>}
							{item.status==1 && <Tag color="danger">派送中</Tag>}
							{item.status==2 && <Tag color="success">已送达</Tag>}
						</div>
						{
							item.wokerId && <div className={styles.rowitemlist}>
								<div>工作者id:</div>
								<div>{item.wokerId}</div>
							</div>
						}
					</div>
					
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>收货人姓名:</div>
							<div>{item.addressName}</div>
						</div>
					</div>
					
					<div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>备注:</div>
							<div>{item.inputData}</div>
						</div>
					</div>
					{
						item.finishImgArr && <div className={styles.rowitem}>
						<div className={styles.rowitemlist}>
							<div>送达照片:</div>
							<div style={{display:"flex",alignItems:"center"}}>{item.finishImgArr.split(",").map(e=><Avatar key={e} src={GlobalConfig.DEFAULT_URL+"/images/orderImg/"+e} onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/orderImg/"+e)} style={{ '--size': '30px',margin:'2px 10px' }}/>)}</div>
						</div>
					</div>
					}
			   </div>
			   {
				   (item.status==0 || item.status==1) && !SuperSending && <div className={styles.footer} onClick={e => e.stopPropagation()}>
					 <Button size="mini" color={item.status==0 ? "primary":"danger"} onClick={() => {handleClick(item)}}>
					   {item.status==0 && "接单"}
					   {item.status==1 && "通知取件"}
					 </Button>
			   </div>
			   }
			   {
				   SuperSending && <div className={styles.footer} onClick={e => e.stopPropagation()}>
				   <Button size="mini" color="danger" onClick={() => {repei(item)}}>重新分配工作者</Button>
				   </div>
			   }
			 </Card>)
			}
			<InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
			</div>
		</>
	)
}


const mapDispatchToProps = {
	changePackageNum(payload){
		return {
			type:"change-packageNum",
			payload
		}
	}
}

export default connect(null,mapDispatchToProps)(MyCardPackage)