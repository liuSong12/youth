import {
	Tag,
	List,
	Input,
	Button,
	Avatar,
	ImageUploader,
	Modal
} from "antd-mobile"
import axios from "axios"
import {
	useRef,
	useState
} from "react"
import GlobalConfig from "../../../../GlobalConfig"

export default function SwiperNotice({
	swiper,
	getNotice
}) {
	const [value, setValue] = useState(null)
	const [isShow, setIsshow] = useState(false)
	const [id, setId] = useState("")
	const [fileList, setFileList] = useState([])
	const [img, setimg] = useState()

	function mockUpload(file) {
		setimg(file)
		return {
			url: URL.createObjectURL(file),
		}
	}


	const handleChange = async () => {
		if (!value.val || !value.type) return;
		let res = await axios.patch(`/manage/changeSwiper?id=${id}&content=${value.val}&type=${value.type}`)
			.then(res => res.data)
		if (res.code !== 1) return;
		await getNotice()
		setIsshow(false)
	}


	const handleClick = (item, type) => {
		if (type == "num") {
			setIsshow(true)
			setValue({
				type,
				val: item[type]
			})
			setId(item.id)
		}
	}
	const setsrc = (image) => {
		Modal.alert({
			image
		})
	}
	const handleupload = async () => {
		if (!img) return;
		let fd = new FormData()
		fd.append("img", img)
		fd.append("type", "swiper")
		let res = await axios.post("/manage/addnotice", fd).then(res => res.data)
		if (res.code !== 1) return;
		setimg(null)
		setFileList([])
		await getNotice()
	}

	const hadnleClci = async (item) => {
		Modal.confirm({
			content: '确认后执行',
			onConfirm: async () => {
				let res = await axios.delete(`/manage/deletenotice?type=swiper&id=${item.id}`).then(
					res => res.data)
				if (res.code !== 1) return;
				await getNotice()
			}
		})
	}

	return ( <
			>
			<
			List > {
				swiper.map(item =>
					<
					List.Item key = {
						item.id
					}
					extra = {
						<
						div style = {
							{
								display: "flex"
							}
						} >
						<
						Button size = "mini"
						onClick = {
							() => {
								hadnleClci(item)
							}
						}
						color = "danger" > 删除 < /Button> <
						div onClick = {
							(e) => handleClick(item, "num")
						} >
						<
						Tag color = "success" > 等级: {
							item.num
						} < /Tag> <
						/div> <
						/div>
					} >
					<
					div style = {
						{
							color: "gray"
						}
					}
					onClick = {
						(e) => handleClick(item, "content")
					} >
					<
					Avatar onClick = {
						() => setsrc(GlobalConfig.DEFAULT_URL + "/images/swiper/" + item.content)
					}
					src = {
						GlobalConfig.DEFAULT_URL + "/images/swiper/" + item.content
					} > < /Avatar> <
					/div> <
					/List.Item>)
				} {
					isShow && < div style = {
							{
								margin: "5px 10px",
								padding: "9px 5px",
								background: "#eeeeee",
								borderRadius: "5px"
							}
						} >
						<
						Input style = {
							{
								background: "white",
								borderRadius: "3px"
							}
						}
					value = {
						value.val
					}
					onChange = {
						(e) => {
							setValue({
								type: value.type,
								val: e
							})
						}
					}
					onBlur = {
						handleChange
					}
					clearable / >
						<
						/div>} {
							!isShow &&
								<
								div style = {
									{
										display: "flex",
										alignItems: "center"
									}
								} >
								<
								ImageUploader value = {
									fileList
								}
							onChange = {
								setFileList
							}
							maxCount = {
								1
							}
							upload = {
								mockUpload
							}
							/> <
							Button color = "primary"
							size = "mini"
							style = {
								{
									height: "35px",
									marginLeft: "10px"
								}
							}
							onClick = {
									handleupload
								} > 上传 < /Button> <
								/div>
						}

						<
						/List> <
						/>
				)
			}