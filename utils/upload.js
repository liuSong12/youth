function upload(tempFilesArr,data,url){
	let len = tempFilesArr.length
	return new Promise((resolve,reject)=>{
		function cicleUpload(len){
			if(len<0) return resolve();
			wx.uploadFile({
				url,
				filePath: tempFilesArr[len].tempFilePath,
				name: 'orderImg',
				header: {
			        //"Content-Type": "multipart/form-data",//记得设置
					"Authorization":`Bearer ${wx.getStorageSync('token')}`
			    },
				formData:data,
				success (res){
					cicleUpload(len-1)
				},
				fail(e){
					uni.showToast({
						title:'出错了',
						icon:'none'
					})
					return reject();
				},
				complete(){
					
				}
			})
		}
		cicleUpload(len-1)
	})
	
}

export default upload