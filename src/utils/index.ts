export const formatPrice = (price: number) => {
	return price.toLocaleString('en-AU', {
		style: 'currency',
		currency: 'AUD',
		minimumFractionDigits: 2,
	});
};

export const isValidURL = (string:string) => {
	if(string){
		// eslint-disable-next-line no-useless-escape
		const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
		return (res !== null);
	}
	return false;
};

export const generateUrlFromTitle = (title:string) => {
	if(title){

		return title.toLowerCase().match(/[a-zA-Z0-9]+/g)?.join('-');
	}
	return '';
};
