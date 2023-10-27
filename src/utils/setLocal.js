export function set(key,data){
	localStorage.setItem(key,JSON.stringify(data))
}

export function remove(key){
	localStorage.removeItem(key)
}

export function get(key){
	return JSON.parse(localStorage.getItem(key))
}