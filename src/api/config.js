const settings = {
    protocol: (process.env.NODE_ENV == 'development')?'http://':'https://',
    host: (process.env.NODE_ENV == 'development')? 'localhost:8000':'api.zielonamapa.pl',
    frontend_host:(process.env.NODE_ENV == 'development')? 'localhost:3000':'zielonamapa.pl',
};

export default Object.freeze({
    host: `${settings.protocol}${settings.host}`,
    baseURL: `${settings.protocol}${settings.host}/api/`,
    fontend: `${settings.protocol}${settings.frontend_host}`
});