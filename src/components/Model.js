import { Button, ImageUploader } from "antd-mobile";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Model(props){
	const [fileList, setFileList] = useState([])//这个是前端的
	const uploadFileList = useRef([])
	
	useEffect(()=>{
		document.documentElement.style.overflow = 'hidden'
		return ()=>{
			uploadFileList.current.length = 0
			document.documentElement.style.overflow = 'scroll';
		}
	},[])
	
	
	
	const mockUpload = async (file)=> {
		let fd = new FormData()
		fd.append("img",file)
		let url = props.uploadImg ? ("/manage/" + props.uploadImg) : "/manage/uploadImg"
		let res = await axios.post(url,fd).then(res=>res.data)
		uploadFileList.current.push(res.data)
		return {
			urlPath:res.data,
			url: URL.createObjectURL(file)
		}
	}
	
	const handleDelete = (e)=>{
		uploadFileList.current = uploadFileList.current.filter(item=>item!==e.urlPath)
	}
	
	return (
	<>
		<div onClick={()=>props.hide()} className="mymodel">
			<div className="mymodel-form" onClick={(e)=>e.stopPropagation()}>
				<ImageUploader className="imgpicker" style={{ '--cell-size': '50px' }} value={fileList} onChange={setFileList} upload={mockUpload} multiple onDelete={(e)=>{handleDelete(e)}} maxCount={5}/>
				<Button className="uploadbtn" color="primary" onClick={()=>props.upload(uploadFileList.current.join(","))}>上传</Button>
			</div>
		</div>
	</>
	)
}
