import axios from 'axios';

const setAuthToken = (token) => {
    if (token) {
        //aply to every req
        axios.defaults.headers.common['Authorization'] = token;
    } else{
        delete axios.defaults.headers.common['Authorization'];
    }
}
export default setAuthToken;
