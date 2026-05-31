import axios from "axios";

const API = axios.create({
    baseURL: "https://sparsh-3dx1.onrender.com"
});

export default API;