export let host = '';
if(process.env.NODE_ENV === 'development') {
    host = 'http://localhost:9000';
} else {
    host = 'http://45.8.251.222:9000';
}