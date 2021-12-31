//https://gist.github.com/Quozzo/3715ad741cfbbd17065fe5e85d4d62c3#file-deepspread-js

export const deepSpread = (...objs: any[]) => {
	return objs.reduce(
		(mixed, obj = {}) => {
			//remove this line to only replace valid indicies instead of the whole array
			if (mixed.constructor === Array) mixed = []
			for (const [key, val] of Object.entries(obj)) {
				if (typeof val === 'object' || typeof mixed[key] === 'object') mixed[key] = deepSpread(mixed[key], val)
				else mixed[key] = val
			}
			return mixed
		},
		objs[1].constructor === Array ? [] : {}
	)
}