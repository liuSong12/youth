import {defineStore} from 'pinia'
import {reactive} from 'vue'

const useHomeStore = defineStore("form",()=>{
	const data = reactive({
		
	})
	return {
		data
	}
})

export default useHomeStore