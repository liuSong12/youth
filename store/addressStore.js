import {defineStore} from 'pinia'
import {reactive} from 'vue'

const useModelStore = defineStore("addressModel",()=>{
	const data = reactive({
		showModel:false
	})
	return {
		data
	}
})

export default useModelStore